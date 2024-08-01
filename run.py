from app import app
from config import Config

if __name__ == '__main__':
    Config.init_app(app)
    app.run(debug=True)