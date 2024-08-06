from app import create_app
from config import Config

app = create_app()

if __name__ == '__main__':
    Config.init_app(app)
    app.run(debug=True)