"""
Panaghia Food Delivery API Tests
Tests for: health, restaurant info, menu categories, menu items, daily menu, reviews, orders
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')


class TestHealthEndpoint:
    """Health check endpoint tests"""
    
    def test_health_check(self):
        """Test /api/health returns healthy status"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        
        data = response.json()
        assert data["status"] == "healthy"
        assert "timestamp" in data


class TestRestaurantInfo:
    """Restaurant info endpoint tests"""
    
    def test_get_restaurant_info(self):
        """Test /api/restaurant/info returns restaurant data"""
        response = requests.get(f"{BASE_URL}/api/restaurant/info")
        assert response.status_code == 200
        
        data = response.json()
        assert data["name"] == "Panaghia"
        assert data["tagline"] == "Autoservire Vatra Dornei"
        assert "phone" in data
        assert "address" in data
        assert "schedule" in data
        assert "hero_image" in data
        # Verify the new restaurant image is set
        assert "customer-assets.emergentagent.com" in data["hero_image"]


class TestMenuCategories:
    """Menu categories endpoint tests"""
    
    def test_get_categories(self):
        """Test /api/menu/categories returns all categories"""
        response = requests.get(f"{BASE_URL}/api/menu/categories")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 6  # At least 6 categories seeded
        
        # Verify category structure
        category = data[0]
        assert "id" in category
        assert "name" in category
        assert "slug" in category
        assert "is_active" in category
        
        # Verify expected categories exist
        category_names = [c["name"] for c in data]
        assert "Ciorbe" in category_names
        assert "Feluri Principale" in category_names
        assert "Garnituri" in category_names


class TestMenuItems:
    """Menu items endpoint tests"""
    
    def test_get_all_items(self):
        """Test /api/menu/items returns all menu items"""
        response = requests.get(f"{BASE_URL}/api/menu/items")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 20  # At least 20 items seeded
        
        # Verify item structure
        item = data[0]
        assert "id" in item
        assert "name" in item
        assert "description" in item
        assert "price" in item
        assert "category_id" in item
        assert "image" in item
    
    def test_get_items_by_category(self):
        """Test filtering items by category"""
        response = requests.get(f"{BASE_URL}/api/menu/items?category_id=ciorbe")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1
        
        # All items should be from ciorbe category
        for item in data:
            assert item["category_id"] == "ciorbe"
    
    def test_get_popular_items(self):
        """Test filtering popular items"""
        response = requests.get(f"{BASE_URL}/api/menu/items?popular_only=true")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        
        # All items should be popular
        for item in data:
            assert item["is_popular"] == True
    
    def test_get_single_item(self):
        """Test getting a single menu item"""
        response = requests.get(f"{BASE_URL}/api/menu/items/1")
        assert response.status_code == 200
        
        data = response.json()
        assert data["id"] == "1"
        assert data["name"] == "Ciorbă de burtă"


class TestDailyMenu:
    """Daily menu endpoint tests"""
    
    def test_get_daily_menu(self):
        """Test /api/menu/daily returns daily menus"""
        response = requests.get(f"{BASE_URL}/api/menu/daily")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 5  # 5 weekdays
        
        # Verify structure
        menu = data[0]
        assert "day" in menu
        assert "soup" in menu
        assert "main" in menu
        
        # Verify days exist
        days = [m["day"] for m in data]
        assert "Luni" in days
        assert "Marți" in days


class TestReviews:
    """Reviews endpoint tests"""
    
    def test_get_reviews(self):
        """Test /api/restaurant/reviews returns reviews"""
        response = requests.get(f"{BASE_URL}/api/restaurant/reviews")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 3  # 3 reviews seeded
        
        # Verify structure
        review = data[0]
        assert "name" in review
        assert "rating" in review
        assert "text" in review
        assert review["rating"] >= 1 and review["rating"] <= 5


class TestOrders:
    """Orders endpoint tests"""
    
    def test_create_order_pickup(self):
        """Test creating a pickup order"""
        order_data = {
            "items": [
                {"menu_item_id": "1", "name": "Ciorbă de burtă", "price": 18, "quantity": 2},
                {"menu_item_id": "5", "name": "Sarmale în foi de viță", "price": 28, "quantity": 1}
            ],
            "customer": {
                "name": "TEST_User Pickup",
                "phone": "0740111222",
                "email": "test@example.com"
            },
            "order_type": "pickup",
            "payment_method": "cash"
        }
        
        response = requests.post(f"{BASE_URL}/api/orders/", json=order_data)
        assert response.status_code == 200
        
        data = response.json()
        assert "id" in data
        assert "order_number" in data
        assert data["order_number"].startswith("ORD-")
        assert data["status"] == "pending"
        assert data["order_type"] == "pickup"
        assert data["total"] == 64  # 18*2 + 28*1
        assert data["customer"]["name"] == "TEST_User Pickup"
    
    def test_create_order_delivery(self):
        """Test creating a delivery order"""
        order_data = {
            "items": [
                {"menu_item_id": "6", "name": "Mici cu muștar", "price": 22, "quantity": 3}
            ],
            "customer": {
                "name": "TEST_User Delivery",
                "phone": "0740333444",
                "address": "Str. Test nr. 123, Vatra Dornei",
                "notes": "Etaj 2, apartament 5"
            },
            "order_type": "delivery",
            "payment_method": "card"
        }
        
        response = requests.post(f"{BASE_URL}/api/orders/", json=order_data)
        assert response.status_code == 200
        
        data = response.json()
        assert data["order_type"] == "delivery"
        assert data["payment_method"] == "card"
        assert data["total"] == 66  # 22*3
        assert data["customer"]["address"] == "Str. Test nr. 123, Vatra Dornei"
    
    def test_get_orders(self):
        """Test getting all orders"""
        response = requests.get(f"{BASE_URL}/api/orders/")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        # Should have at least the orders we created
        assert len(data) >= 1


class TestAPIRoot:
    """API root endpoint tests"""
    
    def test_api_root(self):
        """Test /api/ returns API info"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        
        data = response.json()
        assert "message" in data
        assert "Panaghia" in data["message"]


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
