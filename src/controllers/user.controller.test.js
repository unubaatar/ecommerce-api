const request = require('supertest');
const app = require("../../app"); 
const User = require('../models/user.model');

jest.mock('../models/user.model');

describe("User Controller Tests", () => {
  afterEach(() => {
    jest.clearAllMocks(); 
  });

  test("should create a user", async () => {
    const query = {
        firstName: "Munhjin",
        lastName: "Batsaikhan",
        email: "seimeiNothingBot@gamil.com",
        password: "123456",
        phone: "99699076"
      };
      
      const response = await fetch('http://localhost:4004/api/users/create', {
        method: 'POST', 
        headers: {
          'Authorization': 'Bearer your_token_here',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(query) 
      });
    expect(response.status).toBe(201);
  });

  test("Should update brand", async () => {
    const query = {
        name: "image",
        image: "jiijii"
      };
      
      const response = await fetch('http://localhost:4004/api/brands/update', {
        method: 'POST', 
        headers: {
          'Authorization': 'Bearer your_token_here',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(query) 
      });
    expect(response.status).toBe(200);
  });
});