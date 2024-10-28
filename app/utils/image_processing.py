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
        'General': {
            'system': "You are a helpful assistant that describes images.",
            'user': "Provide a thorough visual description of this image, detailing its composition, structure and how each element is precisely related to each other with context. Give the response in paragraph form"
        },
        'Exam': {
            'system': "You are a helpful assistant that describes images.",
            'user': "Describe this image in high detail and include all visual aspects without providing any context, information, or tips that could give an advantage in an exam setting."
        },
        'Data Structures': {
            'system': "You are a helpful assistant that only describess.",
            'user': "if this image is related to data structures, describe this image in high detail and include all visual aspects. Respond with N/A if the image is not directly related to data structures."
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