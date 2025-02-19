db.createUser({
    user: "trd_user",
    pwd: "trd_password",
    roles: [{ role: "readWrite", db: "trd" }]
});

db.createCollection("matches");