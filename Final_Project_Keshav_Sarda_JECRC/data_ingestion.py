import kagglehub
import os

def download_data():
    print("Downloading dataset...")
    # Download latest version
    path = kagglehub.dataset_download("jeanmidev/smart-meters-in-london")
    print("Path to dataset files:", path)
    return path

if __name__ == "__main__":
    download_data()
