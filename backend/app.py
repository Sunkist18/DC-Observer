from flask import Flask, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
from fake_useragent import UserAgent

app = Flask(__name__)

CORS(app)  # 모든 도메인에서 오는 요청을 허용

# Function to fetch titles from DCInside board
def fetch_titles(gall_id):
    url = f"https://gall.dcinside.com/board/lists/?id={gall_id}"
    headers = {
        "User-Agent": UserAgent(browsers=["chrome"], os="windows").chrome,
    }
    response = requests.get(url, headers=headers)

    # Check if the request was successful (마이너 갤러리 체크)
    if "location.replace" in response.text:
        minor_url = url.replace("board/", "mgallery/board/")
        response = requests.get(minor_url, headers=headers)
    
    soup = BeautifulSoup(response.text, "html.parser")

    # Find the table headers
    headers = [th.get_text(strip=True) for th in soup.find_all("th", scope="col")]
    # Assuming the data follows immediately in <tr> tags under a common parent with headers
    posts = soup.find_all('tr', class_='ub-content us-post')
    img_span = soup.find(class_="cover")
    if img_span:
        img_span = img_span["style"]
        img_url = img_span.split("url(")[1].split(")")[0]
    else:
        img_url = None
    # Prepare to collect data
    extracted_data = []

    # Iterate over posts
    for post in posts:
        title_element = post.find('td', class_='gall_tit ub-word')
        
        # Skip notices (those with <b> tags in the title)
        if '<b>' in str(title_element):
            continue
        
        row_data = {}
        cols = post.find_all("td")

        # Map data based on headers (assuming headers are consistent with columns)
        for i, header in enumerate(headers):
            row_data[header] = cols[i].get_text(strip=True)
        
        row_data["제목"] = title_element.get_text(strip=True).split('[')[0]
        row_data["이미지"] = img_url
        row_data["댓글수"] = 0 if "[" not in row_data["제목"] else int(row_data["제목"].split("[")[-1].split("]")[0])
        extracted_data.append(row_data)

    # Sort extracted data based on post number
    extracted_data.sort(key=lambda x: int(x["번호"]) if x["번호"].isdigit() else float('inf'))
    return extracted_data


@app.route("/posts/<gall_id>", methods=["GET"])
def get_posts(gall_id):
    try:
        posts = fetch_titles(gall_id)
        if len(posts) == 0:
            jsonify({"error": "posts not found"}), 404
        return jsonify(posts)
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run("0.0.0.0")
