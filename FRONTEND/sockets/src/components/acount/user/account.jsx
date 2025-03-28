import React, { useState, useEffect } from "react";
import {
  Container, Card, Button, Table, Tabs, Tab,
  Row, Col, Image, Form, Modal, Alert, Badge
} from "react-bootstrap";
import {
  FaBox, FaEdit, FaTrash, FaUserCircle,
  FaImage, FaKey, FaSignOutAlt, FaPlus
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const UserDashboard = () => {
  const [key, setKey] = useState("items");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  
  const [userProfile, setUserProfile] = useState({
    name: "John Doe",
    email: "user@example.com",
    avatar: "",
    joinDate: "Joined January 2023"
  });
  
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setItems([
        { 
          id: 1, 
          name: "Vintage Camera", 
          description: "Excellent condition, barely used", 
          category: "Electronics",
          price: 120,
          status: "Active",
          date: "2023-05-15"
        },
        { 
          id: 2, 
          name: "Leather Jacket", 
          description: "Genuine leather, size M", 
          category: "Clothing",
          price: 75,
          status: "Sold",
          date: "2023-04-22"
        }
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    if (avatarFile) {
      const newAvatarUrl = URL.createObjectURL(avatarFile);
      setUserProfile({...userProfile, avatar: newAvatarUrl});
    }
    setShowProfileModal(false);
    setAvatarPreview(null);
    setAvatarFile(null);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    // Add password change logic here
    setShowPasswordModal(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const removeAvatar = () => {
    setAvatarPreview(null);
    setAvatarFile(null);
    setUserProfile({...userProfile, avatar: ""});
  };

  const handleSaveItem = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const itemData = Object.fromEntries(formData.entries());
    
    if (editingItem) {
      // Update existing item
      setItems(items.map(item => 
        item.id === editingItem.id ? { ...item, ...itemData } : item
      ));
    } else {
      // Add new item
      const newItem = {
        id: items.length + 1,
        ...itemData,
        status: "Active",
        date: new Date().toISOString().split('T')[0]
      };
      setItems([...items, newItem]);
    }
    
    setShowItemModal(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setShowItemModal(true);
  };

  const renderEmptyState = (message, action) => (
    <Card className="border-0 shadow-sm">
      <Card.Body className="text-center py-5">
        <p className="text-muted mb-3">{message}</p>
        {action && (
          <Button variant="primary" onClick={() => setShowItemModal(true)}>
            <FaPlus className="me-1" /> {action}
          </Button>
        )}
      </Card.Body>
    </Card>
  );

  return (
    <Container className="py-4">
      {/* User Profile Section */}
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body className="p-4">
          <Row className="align-items-center">
            <Col md={2} className="text-center mb-3 mb-md-0">
              {userProfile.avatar ? (
                <Image 
                  src={userProfile.avatar} 
                  roundedCircle 
                  width={100} 
                  height={100} 
                  className="border object-fit-cover"
                  alt="User avatar"
                />
              ) : (
                <div className="d-flex justify-content-center align-items-center bg-light rounded-circle" 
                  style={{width: 100, height: 100}}>
                  <FaUserCircle size={60} className="text-secondary" />
                </div>
              )}
            </Col>
            <Col md={6} className="mb-3 mb-md-0">
              <h3 className="mb-2">{userProfile.name}</h3>
              <p className="text-muted mb-1">
                <strong>Email:</strong> {userProfile.email}
              </p>
              <p className="text-muted">
                {userProfile.joinDate}
              </p>
            </Col>
            <Col md={4} className="d-flex flex-column flex-md-row justify-content-md-end gap-2">
              <Button 
                variant="outline-primary" 
                className="text-nowrap"
                onClick={() => setShowProfileModal(true)}
              >
                <FaEdit className="me-1" /> Edit Profile
              </Button>
              <Button 
                variant="outline-secondary" 
                className="text-nowrap"
                onClick={() => setShowPasswordModal(true)}
              >
                <FaKey className="me-1" /> Change Password
              </Button>
              <Button variant="outline-danger" className="text-nowrap">
                <FaSignOutAlt className="me-1" /> Logout
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Dashboard Tabs */}
      <h2 className="mb-3">My Dashboard</h2>
      <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
        <Tab eventKey="items" title="My Items">
          {loading ? (
            <div className="text-center py-5">Loading your items...</div>
          ) : items.length > 0 ? (
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-end mb-3">
                  <Button variant="primary" onClick={() => {
                    setEditingItem(null);
                    setShowItemModal(true);
                  }}>
                    <FaPlus className="me-1" /> Add Item
                  </Button>
                </div>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Description</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td className="text-truncate" style={{maxWidth: '200px'}}>{item.description}</td>
                        <td>{item.category}</td>
                        <td>${item.price}</td>
                        <td>
                          <Badge bg={item.status === 'Active' ? 'success' : 'secondary'}>
                            {item.status}
                          </Badge>
                        </td>
                        <td>{item.date}</td>
                        <td>
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            className="me-2"
                            onClick={() => handleEditItem(item)}
                          >
                            <FaEdit />
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <FaTrash />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          ) : (
            renderEmptyState("You haven't listed any items yet.", "Add Your First Item")
          )}
        </Tab>
      </Tabs>

      {/* Edit Profile Modal */}
      <Modal show={showProfileModal} onHide={() => {
        setShowProfileModal(false);
        setAvatarPreview(null);
        setAvatarFile(null);
      }}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleProfileUpdate}>
          <Modal.Body>
            <Form.Group className="mb-4 text-center">
              <div className="position-relative d-inline-block">
                {avatarPreview || userProfile.avatar ? (
                  <>
                    <Image 
                      src={avatarPreview || userProfile.avatar} 
                      roundedCircle 
                      width={120} 
                      height={120} 
                      className="border object-fit-cover mb-2"
                      alt="Avatar preview"
                    />
                    <Button 
                      variant="danger" 
                      size="sm" 
                      className="position-absolute top-0 end-0 rounded-circle"
                      onClick={removeAvatar}
                    >
                      <FaTrash size={12} />
                    </Button>
                  </>
                ) : (
                  <div className="d-flex justify-content-center align-items-center bg-light rounded-circle mb-2" 
                    style={{width: 120, height: 120}}>
                    <FaUserCircle size={60} className="text-secondary" />
                  </div>
                )}
                <div>
                  <Form.Label 
                    htmlFor="avatarUpload" 
                    className="btn btn-sm btn-outline-primary mt-2"
                  >
                    <FaImage className="me-1" /> {avatarPreview ? "Change" : "Upload"} Avatar
                  </Form.Label>
                  <Form.Control 
                    type="file" 
                    id="avatarUpload" 
                    accept="image/*" 
                    className="d-none"
                    onChange={handleAvatarChange}
                  />
                </div>
              </div>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control 
                type="text" 
                name="name"
                value={userProfile.name}
                onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email" 
                name="email"
                value={userProfile.email}
                onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => {
              setShowProfileModal(false);
              setAvatarPreview(null);
              setAvatarFile(null);
            }}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Add/Edit Item Modal */}
      <Modal show={showItemModal} onHide={() => {
        setShowItemModal(false);
        setEditingItem(null);
      }} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingItem ? "Edit Item" : "Add New Item"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSaveItem}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Item Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="name"
                    defaultValue={editingItem?.name || ""}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select name="category" defaultValue={editingItem?.category || ""} required>
                    <option value="">Select category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Books">Books</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                name="description"
                defaultValue={editingItem?.description || ""}
                required
              />
            </Form.Group>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price ($)</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="price"
                    min="0"
                    step="0.01"
                    defaultValue={editingItem?.price || ""}
                    required
                  />
                </Form.Group>
              </Col>
              {editingItem && (
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select name="status" defaultValue={editingItem?.status || "Active"}>
                      <option value="Active">Active</option>
                      <option value="Sold">Sold</option>
                      <option value="Pending">Pending</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              )}
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => {
              setShowItemModal(false);
              setEditingItem(null);
            }}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingItem ? "Update Item" : "Add Item"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Change Password Modal */}
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handlePasswordChange}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Current Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Enter current password" 
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Enter new password" 
                minLength="8"
                required
              />
              <Form.Text className="text-muted">
                Password must be at least 8 characters long
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Confirm new password" 
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => setShowPasswordModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Update Password
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default UserDashboard;