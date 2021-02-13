db.createUser(
    {
        user: "roshy",
        pwd: "Password1*",
        roles: [
            {
                role: 'readWrite',
                db: 'roshydb'
              }
        ]
    }
);