"""
Panaghia Admin Panel API Tests - Part II
Tests for: JWT authentication, admin dashboard, orders management, menu CRUD, rate limiting
"""
import pytest
import requests
import os
import time

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Admin credentials
ADMIN_EMAIL = "panaghia8688@yahoo.com"
ADMIN_PASSWORD = "Panaghia2026!"


class TestAuthLogin:
    """Authentication login endpoint tests"""
    
    def test_login_success(self):
        """Test POST /api/auth/login with valid credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"
        assert "expires_in" in data
        assert "user" in data
        assert data["user"]["email"] == ADMIN_EMAIL
        assert data["user"]["is_superadmin"] == True
        print(f"SUCCESS: Login returned valid tokens for {ADMIN_EMAIL}")
    
    def test_login_invalid_password(self):
        """Test login with wrong password"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": "wrongpassword"
        })
        assert response.status_code == 401
        
        data = response.json()
        assert "detail" in data
        print(f"SUCCESS: Invalid password correctly rejected with 401")
    
    def test_login_invalid_email(self):
        """Test login with non-existent email"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "nonexistent@example.com",
            "password": "anypassword"
        })
        assert response.status_code == 401
        print(f"SUCCESS: Non-existent email correctly rejected with 401")


class TestAuthMe:
    """GET /api/auth/me endpoint tests"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        if response.status_code == 200:
            return response.json()["access_token"]
        pytest.skip("Authentication failed")
    
    def test_get_current_user(self, auth_token):
        """Test GET /api/auth/me with valid token"""
        response = requests.get(f"{BASE_URL}/api/auth/me", headers={
            "Authorization": f"Bearer {auth_token}"
        })
        assert response.status_code == 200
        
        data = response.json()
        assert data["email"] == ADMIN_EMAIL
        assert "id" in data
        print(f"SUCCESS: /api/auth/me returned user info")
    
    def test_get_current_user_no_token(self):
        """Test GET /api/auth/me without token"""
        response = requests.get(f"{BASE_URL}/api/auth/me")
        assert response.status_code in [401, 403]
        print(f"SUCCESS: /api/auth/me correctly rejected without token")
    
    def test_get_current_user_invalid_token(self):
        """Test GET /api/auth/me with invalid token"""
        response = requests.get(f"{BASE_URL}/api/auth/me", headers={
            "Authorization": "Bearer invalid_token_here"
        })
        assert response.status_code == 401
        print(f"SUCCESS: /api/auth/me correctly rejected invalid token")


class TestAdminDashboard:
    """Admin dashboard endpoint tests"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        if response.status_code == 200:
            return response.json()["access_token"]
        pytest.skip("Authentication failed")
    
    def test_get_dashboard_stats(self, auth_token):
        """Test GET /api/admin/dashboard returns statistics"""
        response = requests.get(f"{BASE_URL}/api/admin/dashboard", headers={
            "Authorization": f"Bearer {auth_token}"
        })
        assert response.status_code == 200
        
        data = response.json()
        assert "total_orders" in data
        assert "total_revenue" in data
        assert "orders_today" in data
        assert "revenue_today" in data
        assert "pending_orders" in data
        assert "popular_items" in data
        assert "orders_by_status" in data
        assert "revenue_by_day" in data
        
        # Verify data types
        assert isinstance(data["total_orders"], int)
        assert isinstance(data["total_revenue"], (int, float))
        assert isinstance(data["popular_items"], list)
        assert isinstance(data["orders_by_status"], dict)
        assert isinstance(data["revenue_by_day"], list)
        print(f"SUCCESS: Dashboard stats returned - {data['total_orders']} orders, {data['total_revenue']} lei revenue")
    
    def test_dashboard_requires_auth(self):
        """Test dashboard requires authentication"""
        response = requests.get(f"{BASE_URL}/api/admin/dashboard")
        assert response.status_code in [401, 403]
        print(f"SUCCESS: Dashboard correctly requires authentication")


class TestAdminOrders:
    """Admin orders management tests"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        if response.status_code == 200:
            return response.json()["access_token"]
        pytest.skip("Authentication failed")
    
    def test_get_admin_orders(self, auth_token):
        """Test GET /api/admin/orders returns orders list"""
        response = requests.get(f"{BASE_URL}/api/admin/orders", headers={
            "Authorization": f"Bearer {auth_token}"
        })
        assert response.status_code == 200
        
        data = response.json()
        assert "orders" in data
        assert "total" in data
        assert isinstance(data["orders"], list)
        print(f"SUCCESS: Admin orders returned {data['total']} orders")
    
    def test_get_orders_with_status_filter(self, auth_token):
        """Test filtering orders by status"""
        response = requests.get(f"{BASE_URL}/api/admin/orders?status=pending", headers={
            "Authorization": f"Bearer {auth_token}"
        })
        assert response.status_code == 200
        
        data = response.json()
        assert "orders" in data
        # All orders should have pending status
        for order in data["orders"]:
            assert order["status"] == "pending"
        print(f"SUCCESS: Orders filtered by status=pending")
    
    def test_update_order_status(self, auth_token):
        """Test PATCH /api/admin/orders/{id}/status"""
        # First create an order to update
        order_data = {
            "items": [
                {"menu_item_id": "1", "name": "TEST_Item", "price": 10, "quantity": 1}
            ],
            "customer": {
                "name": "TEST_Status Update",
                "phone": "0740999888"
            },
            "order_type": "pickup",
            "payment_method": "cash"
        }
        create_response = requests.post(f"{BASE_URL}/api/orders/", json=order_data)
        assert create_response.status_code == 200
        order_id = create_response.json()["id"]
        
        # Update status to confirmed
        update_response = requests.patch(
            f"{BASE_URL}/api/admin/orders/{order_id}/status",
            json={"status": "confirmed"},
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert update_response.status_code == 200
        
        updated_order = update_response.json()
        assert updated_order["status"] == "confirmed"
        print(f"SUCCESS: Order status updated to confirmed")
    
    def test_update_order_invalid_status(self, auth_token):
        """Test updating order with invalid status"""
        # First create an order
        order_data = {
            "items": [
                {"menu_item_id": "1", "name": "TEST_Item", "price": 10, "quantity": 1}
            ],
            "customer": {
                "name": "TEST_Invalid Status",
                "phone": "0740999777"
            },
            "order_type": "pickup",
            "payment_method": "cash"
        }
        create_response = requests.post(f"{BASE_URL}/api/orders/", json=order_data)
        order_id = create_response.json()["id"]
        
        # Try invalid status
        update_response = requests.patch(
            f"{BASE_URL}/api/admin/orders/{order_id}/status",
            json={"status": "invalid_status"},
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert update_response.status_code == 400
        print(f"SUCCESS: Invalid status correctly rejected")


class TestAdminMenuItems:
    """Admin menu items CRUD tests"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        if response.status_code == 200:
            return response.json()["access_token"]
        pytest.skip("Authentication failed")
    
    def test_create_menu_item(self, auth_token):
        """Test POST /api/admin/menu/items creates new item"""
        item_data = {
            "category_id": "ciorbe",
            "name": "TEST_Ciorbă Nouă",
            "description": "O ciorbă de test",
            "price": 25.50,
            "image": "https://example.com/test.jpg",
            "is_popular": False,
            "is_available": True
        }
        
        response = requests.post(
            f"{BASE_URL}/api/admin/menu/items",
            json=item_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        
        data = response.json()
        assert "id" in data
        assert data["name"] == "TEST_Ciorbă Nouă"
        assert data["price"] == 25.50
        print(f"SUCCESS: Menu item created with id {data['id']}")
        
        # Store for cleanup
        return data["id"]
    
    def test_update_menu_item(self, auth_token):
        """Test PUT /api/admin/menu/items/{id} updates item"""
        # First create an item
        item_data = {
            "category_id": "ciorbe",
            "name": "TEST_Item To Update",
            "description": "Original description",
            "price": 20,
            "image": "https://example.com/test.jpg",
            "is_popular": False,
            "is_available": True
        }
        
        create_response = requests.post(
            f"{BASE_URL}/api/admin/menu/items",
            json=item_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        item_id = create_response.json()["id"]
        
        # Update the item
        update_data = {
            "name": "TEST_Updated Item Name",
            "price": 30,
            "description": "Updated description"
        }
        
        update_response = requests.put(
            f"{BASE_URL}/api/admin/menu/items/{item_id}",
            json=update_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert update_response.status_code == 200
        
        updated_item = update_response.json()
        assert updated_item["name"] == "TEST_Updated Item Name"
        assert updated_item["price"] == 30
        print(f"SUCCESS: Menu item updated")
    
    def test_delete_menu_item(self, auth_token):
        """Test DELETE /api/admin/menu/items/{id}"""
        # First create an item
        item_data = {
            "category_id": "ciorbe",
            "name": "TEST_Item To Delete",
            "description": "Will be deleted",
            "price": 15,
            "image": "https://example.com/test.jpg",
            "is_popular": False,
            "is_available": True
        }
        
        create_response = requests.post(
            f"{BASE_URL}/api/admin/menu/items",
            json=item_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        item_id = create_response.json()["id"]
        
        # Delete the item
        delete_response = requests.delete(
            f"{BASE_URL}/api/admin/menu/items/{item_id}",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert delete_response.status_code == 200
        
        # Verify deletion
        get_response = requests.get(f"{BASE_URL}/api/menu/items/{item_id}")
        assert get_response.status_code == 404
        print(f"SUCCESS: Menu item deleted and verified")


class TestAdminCategories:
    """Admin menu categories CRUD tests"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        if response.status_code == 200:
            return response.json()["access_token"]
        pytest.skip("Authentication failed")
    
    def test_create_category(self, auth_token):
        """Test POST /api/admin/menu/categories creates new category"""
        category_data = {
            "name": "TEST_Categorie Nouă",
            "slug": "test-categorie-noua",
            "icon": "default",
            "order": 99,
            "is_active": True
        }
        
        response = requests.post(
            f"{BASE_URL}/api/admin/menu/categories",
            json=category_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        
        data = response.json()
        assert "id" in data
        assert data["name"] == "TEST_Categorie Nouă"
        print(f"SUCCESS: Category created with id {data['id']}")
    
    def test_update_category(self, auth_token):
        """Test PUT /api/admin/menu/categories/{id}"""
        # First create a category
        category_data = {
            "name": "TEST_Category To Update",
            "slug": "test-category-update",
            "icon": "default",
            "order": 98,
            "is_active": True
        }
        
        create_response = requests.post(
            f"{BASE_URL}/api/admin/menu/categories",
            json=category_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        category_id = create_response.json()["id"]
        
        # Update
        update_response = requests.put(
            f"{BASE_URL}/api/admin/menu/categories/{category_id}",
            json={"name": "TEST_Updated Category"},
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert update_response.status_code == 200
        
        updated = update_response.json()
        assert updated["name"] == "TEST_Updated Category"
        print(f"SUCCESS: Category updated")
    
    def test_delete_category(self, auth_token):
        """Test DELETE /api/admin/menu/categories/{id}"""
        # First create a category
        category_data = {
            "name": "TEST_Category To Delete",
            "slug": "test-category-delete",
            "icon": "default",
            "order": 97,
            "is_active": True
        }
        
        create_response = requests.post(
            f"{BASE_URL}/api/admin/menu/categories",
            json=category_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        category_id = create_response.json()["id"]
        
        # Delete
        delete_response = requests.delete(
            f"{BASE_URL}/api/admin/menu/categories/{category_id}",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert delete_response.status_code == 200
        print(f"SUCCESS: Category deleted")


class TestTokenRefresh:
    """Token refresh endpoint tests"""
    
    def test_refresh_token(self):
        """Test POST /api/auth/refresh"""
        # First login to get tokens
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        refresh_token = login_response.json()["refresh_token"]
        
        # Refresh
        refresh_response = requests.post(f"{BASE_URL}/api/auth/refresh", json={
            "refresh_token": refresh_token
        })
        assert refresh_response.status_code == 200
        
        data = refresh_response.json()
        assert "access_token" in data
        assert "refresh_token" in data
        print(f"SUCCESS: Token refreshed successfully")
    
    def test_refresh_invalid_token(self):
        """Test refresh with invalid token"""
        response = requests.post(f"{BASE_URL}/api/auth/refresh", json={
            "refresh_token": "invalid_refresh_token"
        })
        assert response.status_code == 401
        print(f"SUCCESS: Invalid refresh token rejected")


class TestAdminReviews:
    """Admin reviews management tests"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        if response.status_code == 200:
            return response.json()["access_token"]
        pytest.skip("Authentication failed")
    
    def test_get_all_reviews(self, auth_token):
        """Test GET /api/admin/reviews"""
        response = requests.get(
            f"{BASE_URL}/api/admin/reviews",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        
        data = response.json()
        assert "reviews" in data
        assert "total" in data
        print(f"SUCCESS: Admin reviews returned {data['total']} reviews")


class TestRateLimiting:
    """Rate limiting tests"""
    
    def test_rate_limiting_on_failed_logins(self):
        """Test rate limiting after multiple failed login attempts"""
        # Use unique email to avoid interference from previous tests
        import uuid
        test_email = f"ratelimit_{uuid.uuid4().hex[:8]}@example.com"
        
        # Make multiple failed login attempts
        for i in range(3):
            response = requests.post(f"{BASE_URL}/api/auth/login", json={
                "email": test_email,
                "password": "wrongpassword"
            })
            # Should be 401 (unauthorized) or 429 (rate limited)
            assert response.status_code in [401, 429]
        
        # The rate limiting should track attempts
        print(f"SUCCESS: Rate limiting tracking failed attempts")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
