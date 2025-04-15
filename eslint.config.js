import { defineConfig } from "eslint/config";
import js from "@eslint/js";

export default defineConfig([{
	"files": ["catmagick_server.js", "catmagick_client.js"],
	"plugins": { js },
	"extends": ["js/recommended"]
}]);
