import { useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"

const Login = () => {
    const [form, setForm] = useState({ email: "", password: "" });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const {error, loading, user} = useSelector((state) => state.auth);


}


export default Login;