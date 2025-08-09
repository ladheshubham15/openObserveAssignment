import os
import subprocess
import time
import requests
import pytest
from dotenv import load_dotenv

BASE_URL = "http://localhost:5080/"  # Replace with the port your exe runs on

load_dotenv()

@pytest.fixture(scope="session", autouse=True)
def start_server():
    """
    Start the OpenObserve server before tests and stop after tests.
    """
    # Set environment variables (from .env or directly here)
    os.environ["ZO_ROOT_USER_EMAIL"] = os.getenv("ZO_ROOT_USER_EMAIL")
    os.environ["ZO_ROOT_USER_PASSWORD"] = os.getenv("ZO_ROOT_USER_PASSWORD")

    # Start the server
    process = subprocess.Popen([r"C:\Users\aaa\OneDrive\Desktop\openObserveAssignment\openobserve.exe"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    # Wait until server is up
    timeout = 60  # seconds
    start_time = time.time()
    while True:
        try:
            res = requests.get(BASE_URL)
            if res.status_code < 500:  # server responding
                break
        except requests.exceptions.ConnectionError:
            pass
        if time.time() - start_time > timeout:
            process.kill()
            raise RuntimeError("Server did not start within timeout.")
        time.sleep(2)

    yield  # Run the tests

    # Stop the server after tests
    process.terminate()
    process.wait()

@pytest.fixture(scope="session")
def auth_cookie():
    """
    Authenticates and returns cookies for API calls.
    """
    login_payload = {
        "name": os.environ["ZO_ROOT_USER_EMAIL"],
        "password": os.environ["ZO_ROOT_USER_PASSWORD"]
    }

    response = requests.post(
        f"{BASE_URL}auth/login",
        json=login_payload,
        headers={"Content-Type": "application/json"}
    )

    assert response.status_code == 200, f"Login failed: {response.text}"
    assert response.cookies, "No cookies returned after login."
    return response.cookies

def test_search_api(auth_cookie):
    search_payload = {
        "query":{
        "end_time": 1754755278221000,
        "from": 0,
        "quick_mode": False,
        "size": 50,
        "sql": 'select * from "default" ',
        "start_time": 1754755218221000,
        }
    }

    response = requests.post(
        f"{BASE_URL}api/default/_search?type=logs&search_type=ui&use_cache=true",
        cookies=auth_cookie,
        json=search_payload
    )

    assert response.status_code == 200, f"Search API failed: {response.text}"
    assert response.text.strip() != "", "Search API returned empty body."
    print("Response Body:", response.text)
