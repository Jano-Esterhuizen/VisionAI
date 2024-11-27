import os
from app import create_app
from config import Config

app = create_app()

if __name__ == '__main__':
    Config.init_app(app)
    # Set the port from the environment variable or default to 5000
    port = int(os.getenv("PORT", 5000))
    # Run the app on host 0.0.0.0 to make it accessible externally
    app.run(host="0.0.0.0", port=port, debug=False)
