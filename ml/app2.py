# from flask import Flask, request, jsonify
# from flask_cors import CORS

# app = Flask(__name__)
# CORS(app)

# @app.route('/process_feedback', methods=['POST'])
# def process_feedback():
#     data = request.get_json()
#     feedback_text = data.get('text', '')

#     # Rule-based simulation (replace with model later)
#     if "nurse" in feedback_text.lower() or "food" in feedback_text.lower():
#         summary = "Patient reported good care during surgery but had concerns about nurse availability, food quality, and cleanliness."
#         report = "Key issues include: 1) Unresponsive night staff; 2) Repetitive, cold food; 3) Poor bathroom hygiene. Positive feedback was given to the surgery and physiotherapy departments."
#         action_plan = [
#             "Assign additional nursing staff during night shifts.",
#             "Revise the food menu and monitor meal temperature.",
#             "Increase housekeeping frequency and implement a daily sanitation checklist."
#         ]
#     else:
#         summary = "No major concerns were reported by the patient."
#         report = "The feedback suggests overall satisfaction with services provided."
#         action_plan = ["Continue maintaining current standards and monitor regularly."]

#     return jsonify({
#         "summary": summary,
#         "report": report,
#         "action_plan": action_plan
#     })

# if __name__ == '__main__':
#     app.run(debug=True)

from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def analyze_feedback(text):
    if "nurse" in text.lower() or "food" in text.lower():
        return {
            "summary": "Patient reported good care during surgery but had concerns about nurse availability, food quality, and cleanliness.",
            "report": "Key issues include: 1) Unresponsive night staff; 2) Repetitive, cold food; 3) Poor bathroom hygiene. Positive feedback was given to the surgery and physiotherapy departments.",
            "action_plan": [
                "Assign additional nursing staff during night shifts.",
                "Revise the food menu and monitor meal temperature.",
                "Increase housekeeping frequency and implement a daily sanitation checklist."
            ]
        }
    else:
        return {
            "summary": "No major concerns were reported by the patient.",
            "report": "The feedback suggests overall satisfaction with services provided.",
            "action_plan": ["Continue maintaining current standards and monitor regularly."]
        }

@app.route('/process_feedback', methods=['POST'])
def process_feedback():
    data = request.get_json()
    feedback_list = data.get('feedbacks', [])

    results = []
    for feedback in feedback_list:
        result = analyze_feedback(feedback)
        results.append({
            "original_text": feedback,
            **result
        })

    return jsonify({"results": results})

if __name__ == '__main__':
    app.run(debug=True)