import boto3
from moto import mock_aws

from migrate_swf_to_s3 import _migrate


class FakeBlob:
    def __init__(self, name, data, content_type="application/x-shockwave-flash"):
        self.name = name
        self._data = data
        self.content_type = content_type

    def download_as_bytes(self):
        return self._data


class FakeGCS:
    def __init__(self, blobs):
        self._blobs = blobs

    def bucket(self, name):
        return name

    def list_blobs(self, bucket, prefix=""):
        return self._blobs


@mock_aws
def test_migrate_swf():
    s3 = boto3.client("s3", region_name="us-east-1")
    s3.create_bucket(Bucket="dest")

    blobs = [FakeBlob("foo.swf", b"flashdata")]
    gcs = FakeGCS(blobs)

    _migrate(gcs, s3, "src", "dest")

    obj = s3.get_object(Bucket="dest", Key="foo.swf")
    assert obj["Body"].read() == b"flashdata"


@mock_aws
def test_dry_run_no_upload():
    s3 = boto3.client("s3", region_name="us-east-1")
    s3.create_bucket(Bucket="dest")

    blobs = [FakeBlob("foo.swf", b"data")]
    gcs = FakeGCS(blobs)

    _migrate(gcs, s3, "src", "dest", dry_run=True)

    resp = s3.list_objects_v2(Bucket="dest")
    assert "Contents" not in resp


@mock_aws
def test_skip_existing():
    s3 = boto3.client("s3", region_name="us-east-1")
    s3.create_bucket(Bucket="dest")
    s3.put_object(Bucket="dest", Key="foo.swf", Body=b"old")

    blobs = [FakeBlob("foo.swf", b"new")]
    gcs = FakeGCS(blobs)

    _migrate(gcs, s3, "src", "dest", skip_existing=True)

    obj = s3.get_object(Bucket="dest", Key="foo.swf")
    assert obj["Body"].read() == b"old"
