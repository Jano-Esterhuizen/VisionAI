import base64
import logging
from app.utils.openai_integration import get_openai_client

def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")

def describe_image(image_path, prompt_type = 'general'):
    client = get_openai_client()
    base64_image = encode_image(image_path)

    prompts = {
        'general': {
            'system': "You are a helpful assistant that describes images for visually impaired users.",
            'user': "Describe this image in detail for a visually impaired person."
        },
        'exam': {
            'system': "You are a helpful assistant that describes images for exam purposes.",
            'user': "Describe only the visual elements of this image without providing any context, information, or tips that could give an advantage in an exam setting."
        },
        'Data Structures': {
            'system': "You are a helpful assistant that only describes images related to data structures.",
            'user': "if this image is related to data structures, Describe this image focusing only on identifying and describing data structures, trees, lists, and related concepts. Respond with N/A if the image is not directly related to data structures."
        }
    }

    if prompt_type not in prompts:
        raise ValueError(f"Invalid prompt type: {prompt_type}")

    prompt = prompts[prompt_type]
    logging.info(f"Using prompt: {prompt}")

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": prompt['system']},
            {"role": "user", "content": [
                {"type": "text", "text": prompt['user']},
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}}
            ]}
        ],
        temperature=0.0
    )
    return response.choices[0].message.content