from flask import Flask
from routes import bp

app = Flask(__name__)
app.register_blueprint(bp)

if __name__ == '__main__':
    # Si vous souhaitez activer le polling en plus du webhook :
    # import threading
    # from routes import poll_messages
    # threading.Thread(target=poll_messages, daemon=True).start()
    
    app.run(debug=True)
