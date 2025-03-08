import dash
import dash_bootstrap_components as dbc
import pandas as pd
import requests
import plotly.express as px
from dash import dcc, html, Input, Output, State, dash_table

API_URL = "http://127.0.0.1:5000"

app = dash.Dash(__name__, external_stylesheets=[dbc.themes.BOOTSTRAP])
app.title = " Book Management Dashboard"

# Layout
app.layout = dbc.Container([

    html.H1(" Book Management Dashboard", className="text-center mt-4"),

    # Login Section
    dbc.Row([
        dbc.Col([
            html.Label("Username : ", style={"margin-bottom": "10px", "display": "block"}),  # 设置为block让Label独占一行
            dcc.Input(id="username", type="text", className="mb-2", style={"display": "block", "width": "12"})
            # 输入框也设置为block
        ], width=12),

        dbc.Col([
            html.Label("Password : ", style={"margin-bottom": "10px", "display": "block"}),  # 设置为block让Label独占一行
            dcc.Input(id="password", type="password", className="mb-2", style={"display": "block", "width": "12"})
            # 输入框也设置为block
        ], width=12),

        dbc.Col([
            html.Button("Login", id="login-btn", className="btn btn-primary"),
            html.Div(id="login-status", className="mt-2")
        ], width=12)
    ], className="mb-4"),

    html.Hr(),

    # Admin Panel
    html.Div(id="admin-panel", style={"display": "none"}, children=[
        dbc.Row([
            dbc.Col(
                [dcc.Input(id="search-input", type="text", placeholder="Search by title or author", className="mb-2",style={"width": "100%", "height": "40px"}),
                 html.Button("Search", id="search-btn", className="btn btn-primary ml-3")],  # 通过 ml-3 添加左边距
                width=8),

            dbc.Col(
                html.Button("Refresh Book List ", id="refresh-btn", className="btn btn-primary mt-3 ml-3"),  # 添加左边距
                width=8)
        ], className="mb-4"),

        # Book Table
        dash_table.DataTable(
            id="books-table",
            columns=[
                {"name": "Book ID", "id": "id"},
                {"name": "Title", "id": "title"},
                {"name": "Author", "id": "author"},
                {"name": "Price", "id": "price"},
                {"name": "Stock", "id": "stock"},
            ],
            page_size=5,
            style_table={'height': '200px', 'overflowY': 'auto'},
            style_cell={'textAlign': 'center'},
            style_header={'backgroundColor': 'lightgrey', 'fontWeight': 'bold'}
        ),

        html.Hr(),

        # Add Book
        html.Label("  Add New Book "),
        dbc.Row([
            dbc.Col(dcc.Input(id="title", type="text", placeholder="Title", className="mb-2"), width=6),
            dbc.Col(dcc.Input(id="author", type="text", placeholder="Author", className="mb-2"), width=6)
        ]),
        dbc.Row([
            dbc.Col(dcc.Input(id="price", type="number", placeholder="Price", className="mb-2"), width=6),
            dbc.Col(dcc.Input(id="stock", type="number", placeholder="Stock", className="mb-2"), width=6)
        ]),
        html.Button("Add Book", id="add-btn", className="btn btn-primary mt-2"),
        html.Div(id="add-status", className="mt-2"),

        html.Hr(),

        # Update Book
        html.Label("  Update Book "),
        dbc.Row([
            dbc.Col(dcc.Dropdown(id="update-book-dropdown", placeholder="Select Book ID", className="mb-2"), width=12),
            dbc.Col(dcc.Input(id="update-title", type="text", placeholder="New Title", className="mb-2"), width=6),
            dbc.Col(dcc.Input(id="update-author", type="text", placeholder="New Author", className="mb-2"), width=6)
        ]),
        dbc.Row([
            dbc.Col(dcc.Input(id="update-price", type="number", placeholder="New Price", className="mb-2"), width=6),
            dbc.Col(dcc.Input(id="update-stock", type="number", placeholder="New Stock", className="mb-2"), width=6)
        ]),
        html.Button("Update Book ️", id="update-btn", className="btn btn-primary mt-2"),
        html.Div(id="update-status", className="mt-2"),

        html.Hr(),

        # Delete Book
        html.Label(" Delete Book "),
        dbc.Row([
            dbc.Col(dcc.Dropdown(id="delete-book-dropdown", placeholder="Select Book ID", className="mb-2"), width=12),
            dbc.Col(html.Button("Delete Book", id="delete-btn", className="btn btn-primary mt-2"), width=12),
        ]),
        html.Div(id="delete-status", className="mt-2"),
    ], className="mb-4"),

    dcc.Store(id="store-token", storage_type="session"),
    dcc.Store(id="store-books", storage_type="session")
])


# Login Callback
@app.callback(
    Output("login-status", "children"),
    Output("admin-panel", "style"),
    Output("store-token", "data"),
    Output("store-books", "data"),
    Output("update-book-dropdown", "options"),
    Output("delete-book-dropdown", "options"),
    Output("books-table", "data"),
    Input("login-btn", "n_clicks"),
    Input("refresh-btn", "n_clicks"),
    Input("search-btn", "n_clicks"),
    State("username", "value"),
    State("password", "value"),
    State("search-input", "value"),
    State("store-token", "data"),
    prevent_initial_call=True
)
def manage_books(login_clicks, refresh_clicks, search_clicks, username, password, search_query, access_token):
    ctx = dash.callback_context
    trigger_id = ctx.triggered[0]["prop_id"].split(".")[0] if ctx.triggered else None

    # 1 Handle login logic
    if trigger_id == "login-btn":
        response = requests.post(f"{API_URL}/login", json={"username": username, "password": password})
        if response.status_code == 200:
            access_token = response.json().get("token")
        else:
            return " Login failed!", {"display": "none"}, None, [], [], [], []

    # 2 Fetch books (for login, refresh, or search)
    books = []
    if access_token:
        response = requests.get(f"{API_URL}/books", headers={"Authorization": f"Bearer {access_token}"})
        if response.status_code == 200:
            books = response.json()

    # 3 Search books
    if search_query:
        books = [book for book in books if
                 search_query.lower() in book['title'].lower() or search_query.lower() in book['author'].lower()]

    # 4 Generate dropdown options
    book_options = [{"label": f"{book['title']} ({book['id']})", "value": book['id']} for book in books]

    return "  Login successful!  ", {"display": "block"}, access_token, books, book_options, book_options, books


# Add Book Callback
# Add Book Callback
@app.callback(
    Output("add-status", "children"),
    Output("title", "value"),
    Output("author", "value"),
    Output("price", "value"),
    Output("stock", "value"),
    Input("add-btn", "n_clicks"),
    State("title", "value"),
    State("author", "value"),
    State("price", "value"),
    State("stock", "value"),
    State("store-token", "data"),
    prevent_initial_call=True
)
def add_book(n_clicks, title, author, price, stock, access_token):
    if not title or not author or not price or not stock:
        return "Please fill in all fields!", title, author, price, stock

    data = {
        "title": title,
        "author": author,
        "price": price,
        "stock": stock
    }

    response = requests.post(
        f"{API_URL}/books", json=data, headers={"Authorization": f"Bearer {access_token}"}
    )

    if response.status_code == 201:
        return "Book added successfully!", "", "", "", ""  # Clear inputs after successful add
    return f"Failed to add book! Error: {response.text}", title, author, price, stock



# Update Book Callback
@app.callback(
    Output("update-status", "children"),
    Output("update-title", "value"),
    Output("update-author", "value"),
    Output("update-price", "value"),
    Output("update-stock", "value"),
    Input("update-btn", "n_clicks"),
    State("update-book-dropdown", "value"),
    State("update-title", "value"),
    State("update-author", "value"),
    State("update-price", "value"),
    State("update-stock", "value"),
    State("store-token", "data"),
    prevent_initial_call=True
)
def update_book(n_clicks, book_id, title, author, price, stock, access_token):
    if not book_id:
        return "Please select a book to update!", title, author, price, stock

    data = {
        "title": title,
        "author": author,
        "price": price,
        "stock": stock
    }

    response = requests.put(
        f"{API_URL}/books/{book_id}", json=data, headers={"Authorization": f"Bearer {access_token}"}
    )

    if response.status_code == 200:
        return "Book updated successfully!", "", "", "", ""  # Clear inputs after successful update
    return "Failed to update book!", title, author, price, stock


# Delete Book Callback
@app.callback(
    Output("delete-status", "children"),
    Input("delete-btn", "n_clicks"),
    State("delete-book-dropdown", "value"),
    State("store-token", "data"),
    prevent_initial_call=True
)
def delete_book(n_clicks, book_id, access_token):
    if not book_id:
        return " Please select a book to delete! "

    response = requests.delete(
        f"{API_URL}/books/{book_id}", headers={"Authorization": f"Bearer {access_token}"}
    )

    if response.status_code == 200:
        return "  Book deleted successfully! "
    return "  Failed to delete book! "


if __name__ == "__main__":
    app.run_server(debug=True)
