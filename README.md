#How to use this project

I assume you already have checked out the backend part, otherwise go to: https://github.com/Davve420/FE25-JS2-slutprojekt-back-david-brolin

The first step is to clone the repository to your device. https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository

Requirements:
- Node.js installed (recommended v18+)
- Backend server running on http://localhost:3000

Next you will need to install all the dependencies for the project. Open your CLI or terminal in vscode. Here you'll need to navigate to the root folder of your project *the same level as the package.json file*.
Here you will type "npm install". This will install all dependencies for the frontend.

To start the project run "npm run dev" at the same place in the CLI.
Now it should say something like "Local: http://localhost:5173/". Open that link in your browser and you will see the project.

To verify that everything compiles correctly (including TypeScript type checks), run:
"npm run build"

If the backend server is running, you should now see data and functionality from backend on the frontend.

If no data appears on frontend:
- Make sure backend is running
- Check that http://localhost:3000/data returns JSON

If there are any problems, please feel free to tell me. 
