"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const PORT = process.env.PORT || 3000;
// Start the server
const startServer = async () => {
    await (0, app_1.initializeApp)();
    app_1.app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};
startServer().catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
//# sourceMappingURL=server.js.map