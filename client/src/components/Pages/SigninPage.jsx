import { useState, useContext } from "react";
import  { useUserContext } from "../../context/AuthContext";
import { loginUser } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  IconBrandGithub,
  IconBrandGoogle,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";

const SigninPage = () => {
    const { login } = useUserContext();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        emailOrUsername: "",
        password: "",
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            const data = await loginUser({
                email: formData.emailOrUsername.includes("@") ? formData.emailOrUsername : undefined,
                username: !formData.emailOrUsername.includes("@") ? formData.emailOrUsername : undefined,
                password: formData.password,
            });
            login(data.token, data.user);
            navigate("/");

        } catch (error) {
            setError(error.response?.data?.message || "Login failed");
        }
    };

   return (
      (<div
        className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
        <h2 className="text-xl text-center font-bold text-neutral-800 dark:text-neutral-200">
          Welcome back to Anonverse
        </h2>  
        {error && <div className="text-red-500">{error}</div>}
        <form className="my-8" onSubmit={handleSubmit}>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="emailOrUsername">Username or Email Address</Label>
            <Input 
            id="emailOrUsername" 
            name="emailOrUsername" 
            placeholder="anonymous or projectmayhem@fc.com" 
            type="text" 
            value={formData.emailOrUsername}
            onChange={handleChange}
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input 
            id="password" 
            name="password"
            placeholder="••••••••" 
            type="password"
            value={formData.password}
            onChange={handleChange}
            />
          </LabelInputContainer>
  
          <button
            className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
            type="submit">
            Sign in &rarr;
            <BottomGradient />
          </button>
  
          <div
            className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

         <p className="font-semibold text-[14px] text-center">New to Anonverse? <Link to={'/sign-up'} className="text-blue-600">Sign Up</Link></p>

          {/* <div className="flex flex-col space-y-4">
            <button
              className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
              type="submit">
              <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                Google
              </span>
              <BottomGradient />
            </button>    
          </div> */}
        </form>
      </div>)
    );
}

export default SigninPage


const BottomGradient = () => {
  return (<>
    <span
      className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span
      className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
  </>);
};

const LabelInputContainer = ({
  children,
  className
}) => {
  return (
    (<div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>)
  );
};
