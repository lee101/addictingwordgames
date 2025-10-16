import hashlib

import boto3
from moto import mock_aws

from flash_storage import FlashAssetStorage


@mock_aws
def test_persist_binary_writes_to_s3():
    s3 = boto3.client("s3", region_name="us-east-1")
    s3.create_bucket(Bucket="flash-bucket")

    data = b"flash binary"

    def fetcher(url: str):
        return data, "application/x-shockwave-flash"

    storage = FlashAssetStorage(
        bucket="flash-bucket",
        prefix="games",
        client=s3,
        fetcher=fetcher,
    )

    asset = storage.persist_binary("https://example.com/game.swf")

    assert asset.checksum == hashlib.sha256(data).hexdigest()
    assert asset.mime_type == "application/x-shockwave-flash"
    assert asset.size == len(data)
    assert asset.storage_path.startswith("games/")

    obj = s3.get_object(Bucket="flash-bucket", Key=asset.storage_path)
    assert obj["Body"].read() == data
    assert obj["ContentType"] == "application/x-shockwave-flash"


@mock_aws
def test_persist_thumbnail_guesses_mime_from_url():
    s3 = boto3.client("s3", region_name="us-east-1")
    s3.create_bucket(Bucket="flash-bucket")

    def fetcher(url: str):
        return b"image-bytes", None

    storage = FlashAssetStorage(
        bucket="flash-bucket",
        prefix="",
        client=s3,
        fetcher=fetcher,
    )

    asset = storage.persist_thumbnail("https://example.com/thumb.png")

    assert asset.mime_type == "image/png"
    assert asset.storage_path.endswith(".png")
    obj = s3.get_object(Bucket="flash-bucket", Key=asset.storage_path)
    assert obj["Body"].read() == b"image-bytes"
