import { createBrowserRouter, } from "react-router-dom";
import App from "./App";
import ChatList from "./pages/ChatList.tsx";
import ChatDetail from "./pages/ChatDetail.tsx";


export const router = createBrowserRouter([
    {
        // This path will have the user registration
        path: "/",
        element: <App/>,
    },
    {
        path: "list",
        element: <ChatList/>,
    },
    {
        path: "detail/:userID",
        element: <ChatDetail/>
    }
    
]);