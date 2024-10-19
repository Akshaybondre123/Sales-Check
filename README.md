# Sales-Check
Features
Transaction Display: View a list of transactions with details like title, description, price, category, date of sale, and sold status.
Search Functionality: Easily search for specific transactions using a keyword.
Pagination: Navigate through transactions page by page.
Error Handling: User-friendly error messages when fetching data fails.
Data Visualization: Bar chart and pie chart integration for statistics.
Responsive Design: Works seamlessly across different devices and screen sizes.

enviornment Variable:
REACT_APP_API_URL=http://localhost:5000

Start the development server:
npm start 

GET /api/transactions: Fetch transactions with pagination, search, and filtering by month.
GET /api/statistics: Fetch statistical data for visualizations.
GET /api/barchart: Fetch bar chart data.
GET /api/piechart: Fetch pie chart data.

Error Handling:
If the app fails to fetch transactions or chart data, it will show an error message.

