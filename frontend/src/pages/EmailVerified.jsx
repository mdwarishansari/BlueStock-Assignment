import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, Card, Typography, Button, CircularProgress } from "@mui/material";
import { CheckCircle, Error } from "@mui/icons-material";
import axios from "axios";
import { useDispatch } from "react-redux";
import { markEmailVerified, fetchUserProfile } from "../store/slices/authSlice";

const EmailVerified = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const urlStatus = searchParams.get("status");
    const urlMsg = searchParams.get("msg");

    // CASE 1: Backend redirect success
    if (urlStatus === "success") {
      setStatus("success");
      setMessage("Email verified successfully!");

      // update redux
      dispatch(markEmailVerified());
      dispatch(fetchUserProfile());

      window.history.replaceState({}, "", "/verify-email?status=success");
      return;
    }

    // CASE 2: Backend redirect error
    if (urlStatus === "error") {
      setStatus("error");
      setMessage(decodeURIComponent(urlMsg || "Verification failed"));

      window.history.replaceState({}, "", "/verify-email?status=error");
      return;
    }

    // CASE 3: No token → invalid link
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link");
      return;
    }

    // CASE 4: Direct token verification → let backend redirect
    if (token) {
      window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/verify-email?token=${token}`;
      return;
    }
  }, [searchParams, dispatch]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: 3,
      }}
    >
      <Card
        sx={{
          maxWidth: 500,
          width: "100%",
          p: 4,
          textAlign: "center",
          borderRadius: 3,
        }}
      >
        {status === "verifying" && (
          <>
            <CircularProgress size={60} sx={{ mb: 3 }} />
            <Typography variant="h5" fontWeight="bold">
              Verifying your email...
            </Typography>
          </>
        )}

        {status === "success" && (
          <>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                bgcolor: "success.light",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 2rem",
              }}
            >
              <CheckCircle sx={{ fontSize: 50, color: "success.main" }} />
            </Box>

            <Typography variant="h5" fontWeight="bold" gutterBottom>
              ✅ Email Verified!
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {message}
            </Typography>

            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/login")}
              fullWidth
            >
              Go to Login
            </Button>
          </>
        )}

        {status === "error" && (
          <>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                bgcolor: "error.light",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 2rem",
              }}
            >
              <Error sx={{ fontSize: 50, color: "error.main" }} />
            </Box>

            <Typography variant="h5" fontWeight="bold" gutterBottom>
              ❌ Verification Failed
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {message}
            </Typography>

            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/login")}
              fullWidth
            >
              Go to Login
            </Button>
          </>
        )}
      </Card>
    </Box>
  );
};

export default EmailVerified;