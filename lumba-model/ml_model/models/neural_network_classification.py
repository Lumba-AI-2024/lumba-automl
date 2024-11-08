# import subprocess

# # Upgrade TensorFlow
# subprocess.run(["pip", "install", "--upgrade", "tensorflow"])

# # Upgrade Keras
# subprocess.run(["pip", "install", "--upgrade", "keras"])

import tensorflow as tf
import numpy as np
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Input,Dense
from scikeras.wrappers import KerasClassifier
from sklearn.model_selection import GridSearchCV,train_test_split, KFold
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score,recall_score,precision_score,f1_score   
import pandas as pd
from pandas import DataFrame, Series
from tensorflow.keras.utils import to_categorical
import time
from typing import Any, Optional, Union, List

def create_model(optimizer='adam', activation='relu', units1=30, units2=20, units3=10, input_shape=(10,), num_classes=1):
            model = Sequential([
                Input(shape=input_shape),
                Dense(units1, activation=activation),
                Dense(units2, activation=activation),
                Dense(units3, activation=activation),
                Dense(num_classes, activation='softmax' if num_classes > 2 else 'sigmoid')
            ])
            loss = 'categorical_crossentropy' if num_classes > 2 else 'binary_crossentropy'
            model.compile(optimizer=optimizer, loss=loss, metrics=['accuracy'])
            return model

class LumbaNeuralNetworkClassification:
    model: KerasClassifier

    def __init__(self, dataframe: DataFrame) -> None:
        self.dataframe = dataframe
    
    def train_model(self, target_column_name: str) -> dict:
        
        X = self.dataframe.drop(columns=[target_column_name])
        y = self.dataframe[target_column_name]
        # Check the number of unique target values
        num_classes = len(np.unique(y))

        # One-hot encode the target if there are more than 2 classes
        units4 = num_classes if num_classes > 2 else 1
        if num_classes > 2:
            y = to_categorical(y, num_classes)
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Set seed for NumPy
        
        np.random.seed(42)

        # Set seed for TensorFlow
        tf.random.set_seed(42)
        
        input_shape = (X_train.shape[1],)

        # Wrap the Keras model in a KerasClassifier
        model = KerasClassifier(
            model=create_model, 
            optimizer='adam', 
            activation='relu', 
            units1=30, 
            units2=20,
            units3=10,    
            input_shape=input_shape, 
            num_classes=units4, 
            verbose=0
        )

        # Define the grid search parameters
        # param_grid = {
        #     'model__optimizer': ['adam', 'rmsprop'],
        #     'model__activation': ['relu', 'sigmoid'],
        #     'model__units1': [32, 64, 128],
        #     'model__units2': [16, 32, 64],
        #     'model__units3': [8, 16, 32],
        #     'epochs': [10, 20, 30, 40,50]  # Adjust the values as needed
        # }

        param_grid = {
            'model__optimizer': ['adam'],
            'model__activation': ['relu'],
            'model__units1': [30, 20],
            'model__units2': [20],
            'model__units3': [10],
            'epochs': [30, 40, 50]  # Adjust the values as needed
        }

        outer_cv = KFold(n_splits=3, shuffle=True, random_state=42)

        # Perform grid search
        grid = GridSearchCV(estimator=model, param_grid=param_grid, cv=outer_cv, error_score='raise')
        grid_result = grid.fit(X_train, y_train)  # Assuming X and y are your feature matrix and target vector
        
        best_hyperparams = grid_result.best_params_

        # Evaluate the best model and count accuracy
        best_model = grid_result.best_estimator_
        start_time = time.time()
        y_pred = best_model.predict(X_test)
        end_time = time.time()
        if num_classes > 2:
            y_test = np.argmax(y_test, axis=1)
            y_pred = np.argmax(y_pred, axis=1)
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
            'best_hyperparams': best_hyperparams,
            'accuracy_score': acc,
            'recall_score': recall,
            'precision_score': precision,
            'f1_score': f1,
            'best_hyperparams': best_hyperparams,
            'time': elapsed_time
        }
    
    def get_model(self) -> Optional[KerasClassifier]:
        try:
            return self.model
        except AttributeError:
            return None

    # def predict(self, data_target: Any) -> Any:
    #     lr = self.get_model()
    #     y_pred = lr.predict(data_target)

    #     return y_pred