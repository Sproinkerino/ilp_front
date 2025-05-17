# ILP Advisor API Documentation

## Endpoint: `POST /api/chat/`

This endpoint powers a stateless chatbot session for collecting investment-linked plan (ILP) details. It handles follow-up questions dynamically and tracks progress using session state passed by the client.

---

## Request

**Method**: `POST`
**Content-Type**: `application/json`

### Body Parameters

| Field     | Type             | Required | Description                                                                    |
| --------- | ---------------- | -------- | ------------------------------------------------------------------------------ |
| `user_id` | `string`         | ✅        | A unique identifier for the user (e.g. UUID, email, or internal ID)            |
| `session` | `object or null` | ❌        | The full session state object returned in previous responses                   |
| `message` | `string or null` | ❌        | The user's reply to the last assistant question. Required after session starts |

### Example Request

```json
{
  "user_id": "abc123",
  "session": null,
  "message": null
}
```

Or, on follow-up:

```json
{
  "user_id": "abc123",
  "session": {
    "answers": {
      "age": "30",
      "amount_paid": "5000"
    },
    "follow_ups": {},
    "history": [],
    "last_question": "What's your regular payment?"
  },
  "message": "I pay $200 every month"
}
```

---

## Response

Returns the assistant's next message and updated session state.

### Response Fields

| Field               | Type     | Description                                             |
| ------------------- | -------- | ------------------------------------------------------- |
| `user_id`           | `string` | Echo of the user ID                                     |
| `session`           | `object` | Updated session state, should be passed back to the API |
| `assistant_message` | `string` | Next assistant message (if chat not done), else `null`  |
| `missing_fields`    | `list`   | Remaining fields required to complete the conversation  |
| `done`              | `bool`   | Whether all required fields have been collected         |

### Example Response

```json
{
  "user_id": "abc123",
  "session": {
    "answers": {
      "age": "30",
      "amount_paid": "5000",
      "payment_amount": "200",
      "payment_frequency": "monthly"
    },
    "follow_ups": {},
    "history": [],
    "last_question": "How much time is left on your plan?"
  },
  "assistant_message": "How much time is left on your plan?",
  "missing_fields": ["remaining_duration", "plan_name"],
  "done": false
}
```

---

## Session Flow

1. **First Request**: Send only `user_id`, `session = null`, and `message = null`.
2. **Bot Responds** with a question (`assistant_message`) and session state.
3. **Follow-Up Requests**: Send back the session object and a user reply in `message`.
4. Continue until `done = true`.

---

## Additional Files to Include for Full Documentation

Please send these files so the full API functionality and logic can be documented:

| File / Module           | Purpose                                                               |
| ----------------------- | --------------------------------------------------------------------- |
| `IlpAdvisor.py`         | Contains `ChatSession` and `ILPAdvisor` logic used for chatflow & NLP |
| `urls.py`               | Maps this view to an API endpoint                                     |
| `serializers.py`        | (If used) For validating/parsing input — if not used, ignore          |
| `.env` (sample only)    | Sample config (hide keys!) to understand required secrets or models   |
| `settings.py` (partial) | At least the REST\_FRAMEWORK and CORS settings                        |
