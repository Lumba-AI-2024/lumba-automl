from django.db import models

from data_science.preprocess import Preprocess
from dataset.models import Dataset
from dataset.serializers import DatasetSerializer
from ml_model.serializers import MLModelSerializer, AutoMLModelSerializer
import pandas as pd
from io import StringIO

# TODO: this should be a class (or classes) of enums
algorithms = {
    'REGRESSION': ('LINEAR', 'DECISION_TREE', 'RANDOM_FOREST', 'NEURAL_NETWORK', 'XG_BOOST'),
    'CLASSIFICATION': ('DECISION_TREE', 'RANDOM_FOREST', 'XG_BOOST', 'NEURAL_NETWORK'),
    'CLUSTERING': ('KMEANS', 'DBSCAN')
}
# Create your models here.
class AutoML(models.Model):
    name = models.CharField(max_length=100)
    dataset = models.ForeignKey(Dataset, related_name='datasets', on_delete=models.CASCADE)
    method = models.CharField(max_length=100, default="-")
    feature = models.TextField(blank=True)
    target = models.TextField(blank=True)
    created_time = models.DateTimeField(auto_now_add=True)
    updated_time = models.DateTimeField(auto_now=True)
    ordinal = models.TextField(null=True, blank=True)
    ordinal_dict = models.TextField(null=True, blank=True)

    def initiate_project(self):
        """
        Initiate preprocessing, and then initiate training for each preprocesses
        :return:
        """

        for scaling in ('vanilla', 'normalization', 'standardization'):
            if self.target != '':
                columns = self.feature.split(',') + self.target.split(',')
            else:
                columns = self.feature.split(',')
            
            print(columns)
            preprocess = Preprocess(dataset=Dataset.objects.get(pk=self.dataset.pk), columns=columns, target_columns=self.target)

            # handle null, duplicate, ordinal encoding, encoding, and scaling
            # TODO: Fix this in preproc
            preproc_kwargs = {
                'missing': '1',
                'columns_missing': '',
                'duplication': '1',
                'columns_duplication': '',
                'ordinal': self.ordinal,
                'dict_ordinal_encoding': self.ordinal_dict,
                'encoding': '1',
                'scaling': '1' if scaling != 'vanilla' else '0',
                'scaling_type': scaling,
            }
            result = preprocess.handle(**preproc_kwargs, filename_prefix=scaling)
            print(result['scaler_file'])
            # Extract columns from the file in result['file']
            print("result ===", result)
            file_content = result['file'].read().decode('utf-8')
            df = pd.read_csv(StringIO(file_content))
            columns_from_file = df.drop(columns = ['Unnamed: 0', self.target]).columns.tolist()
            print("Columns in file:", columns_from_file)

            payload = result
                
            serializer = DatasetSerializer(data={**payload})
            if serializer.is_valid():
                scaled_dataset = serializer.save()
                for algorithm in algorithms[self.method]:
                    model_payload = {
                        'name': f"{scaling}_{algorithm}_{self.name}",
                        'dataset': scaled_dataset.pk,
                        'datasetname': scaled_dataset.name,
                        'method': self.method,
                        'algorithm': algorithm,
                        'feature': ','.join(columns_from_file),
                        'target': self.target,
                        'autoML_project': self.pk,
                        'scaler': result['scaler_file'] if scaling != 'vanilla' else None,
                    }
                    serializer = AutoMLModelSerializer(data=model_payload)
                    if serializer.is_valid():
                        model = serializer.save()
                        model.initiate_training()
                    print(f"{model_payload['name']}")
                    print(f"{serializer.errors}")
            print(f"{scaling}_{self.dataset.name}")
            print(serializer.errors)

    def retrain_all(self):

        for model in self.automlmodels.all():
            model.initiate_training()
