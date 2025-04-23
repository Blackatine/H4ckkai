# Chatbot Web Application

## Overview

This project is a Flask-based web application designed to function as a cybersecurity expert assistant. It utilizes OpenAI's API to generate intelligent responses to user queries, and fetches the latest cybersecurity news using NewsAPI.

## Features

- **Chatbot Functionality**: Uses OpenAI's GPT-3.5-turbo model to provide expert responses on cybersecurity topics.
- **News Fetching**: Retrieves and caches the latest cybersecurity news from NewsAPI.
- **RESTful API**: Provides endpoints for chat, order creation, payment verification, and news retrieval.

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Environment Variables**: Create a `.env` file in the `web` directory with the following variables:
   - `OPENAI_API_KEY`
   - `NEWS_API_KEY`

4. **Run the application**:
   ```bash
   python web/app.py
   ```

## Usage

- **Chat Endpoint**: Send POST requests to `/chat` with a JSON payload containing a `message` field.
- **Create Order**: Send POST requests to `/create-order` to initiate a payment.
- **Verify Payment**: Send POST requests to `/verify-payment` with Razorpay payment details.
- **Get News**: Access `/api/news` to retrieve the latest cybersecurity news.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any inquiries or support, please contact himanshichaudhary261@gmail.com.
