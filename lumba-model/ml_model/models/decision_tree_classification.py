from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import GridSearchCV,train_test_split, KFold
from sklearn.metrics import accuracy_score,recall_score,precision_score,f1_score
import pandas as pd
import time

import pandas as pd
from pandas import DataFrame, Series

from typing import Any, List, Optional

class LumbaDecisionTreeClassifier:
    model: DecisionTreeClassifier

    def __init__(self, dataframe: DataFrame) -> None:
        self.dataframe = dataframe

    def train_model(self, target_column_name: str) -> dict:
        
        X = self.dataframe.drop(columns=[target_column_name])
        y = self.dataframe[target_column_name]  

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        dt = DecisionTreeClassifier(random_state = 42)

        param_grid = {
            'criterion': ['gini', 'entropy'],
            'max_depth': [2,4,8,10],
            # 'min_samples_split': [1,2,3,4,5],
            # 'min_samples_leaf': [1,2,3,4,5]
        }

        outer_cv = KFold(n_splits=5, shuffle=True, random_state=42)

        grid = GridSearchCV(estimator=dt, param_grid=param_grid, cv=outer_cv, return_train_score=True)
        grid_result = grid.fit(X_train, y_train)

        best_hyperparams = grid_result.best_params_

        # Evaluate the best model and count accuracy
        best_model = grid_result.best_estimator_
        
        start_time = time.time()
        
        y_pred = best_model.predict(X_test)
        
        end_time = time.time()
        
        num_classes = len(pd.unique(y))
        if num_classes > 2:
            average_method = 'macro'
        else:
            average_method = 'binary'

        acc = accuracy_score(y_true=y_test, y_pred=y_pred)
        recall = recall_score(y_true=y_test, y_pred=y_pred, average=average_method)
        precision = precision_score(y_true=y_test, y_pred=y_pred, average=average_method)
        f1 = f1_score(y_true=y_test, y_pred=y_pred, average=average_method)
        elapsed_time = end_time - start_time
    
        self.model = best_model
        X_test_df = pd.DataFrame(X_test, columns=self.dataframe.drop(columns=[target_column_name]).columns)
        X_train_df = pd.DataFrame(X_train, columns=self.dataframe.drop(columns=[target_column_name]).columns)
        
        return {
            'model': best_model,
            'X_train': X_train_df,
            'X_test': X_test_df,
            'accuracy_score': acc,
            'recall_score': recall,
            'precision_score': precision,
            'f1_score': f1,
            'best_hyperparams': best_hyperparams,
            'time': elapsed_time
        }

    def get_model(self) -> Optional[DecisionTreeClassifier]:
        try:
            return self.model
        except AttributeError:
            return None

    # def predict(self, data_target: Any) -> Any:
    #     dt = self.get_model()
    #     y_pred = dt.predict(data_target)

    #     return y_pred