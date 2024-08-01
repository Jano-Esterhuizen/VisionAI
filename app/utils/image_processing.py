import base64
from app.utils.openai_integration import get_openai_client

def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")

def describe_image(image_path):
    client = get_openai_client()
    base64_image = encode_image(image_path)
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a helpful assistant that describes images for visually impaired users."},
            {"role": "user", "content": [
                {"type": "text", "text": "Describe this image."},
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}}
            ]}
        ],
        temperature=0.0
    )
    return response.choices[0].message.content