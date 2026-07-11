import pandas as pd
import os

data_dir = 'data'
daily_file = os.path.join(data_dir, 'daily_dataset.csv')
info_file = os.path.join(data_dir, 'informations_households.csv')

print(f"Loading {info_file}...")
if os.path.exists(info_file):
    info_df = pd.read_csv(info_file)
    print(info_df.head())
    print("Info shape:", info_df.shape)

print(f"Loading a chunk of {daily_file}...")
if os.path.exists(daily_file):
    # Load just a chunk to inspect
    daily_chunk = pd.read_csv(daily_file, nrows=5)
    print(daily_chunk.head())
    print("Columns:", daily_chunk.columns)

print("EDA preview complete.")
