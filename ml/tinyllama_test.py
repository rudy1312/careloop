def generate_action_report(feedback_json_string, llm_instance):
    try:
        feedback_data = json.loads(feedback_json_string)
        feedback_str = json.dumps(feedback_data, indent=2) # Convert to a readable JSON string

        prompt_summary = f"""What are the main topics discussed in the following feedback?
Feedback:
{feedback_str}
Provide a concise overview."""
        summary_output = llm_instance(prompt_summary, max_tokens=200)
        summary = summary_output["choices"][0]["text"].strip()

        prompt_report = f"""Generate a short report based on the following feedback:
        {feedback_str}
        Highlight key trends, common issues, and positive aspects mentioned in the feedback."""
        report_output = llm_instance(prompt_report, max_tokens=300)
        report = report_output["choices"][0]["text"].strip()

        prompt_action_plan = f"""Based on the following feedback, suggest a prioritized action plan to address the issues raised:
        {feedback_str}
        Identify specific, measurable, achievable, relevant, and time-bound (SMART) actions where possible."""
        action_plan_output = llm_instance(prompt_action_plan, max_tokens=300)
        action_plan = action_plan_output["choices"][0]["text"].strip()

        report_data = {
            "summary": summary,
            "report": report,
            "action_plan": action_plan
        }
        return report_data

    except json.JSONDecodeError as e:
        return f"Error decoding JSON: {e}"