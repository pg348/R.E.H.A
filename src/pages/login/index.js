import React, { useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { meta } from "../../content_option";
import { Container, Row, Col, Alert, Button } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://nkotlqqoqgudqbsjygmn.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rb3RscXFvcWd1ZHFic2p5Z21uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY3ODg4MjQsImV4cCI6MjAyMjM2NDgyNH0.M4PpTHMpIDkE8tSl3s1VirL5vI6H6UrYWx53alfIorQ"
);

export const Login = () => {
  const [formData, setFormdata] = useState({
    email: "",
    loading: false,
    show: false,
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormdata({ ...formData, loading: true });

    try {
      const { user, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setFormdata({
          ...formData,
          loading: false,
          alertmessage: error.message,
          variant: "danger",
          show: true,
        });
      } else {
        setFormdata({
          ...formData,
          loading: false,
          alertmessage: "Login successful",
          variant: "success",
          show: true,
        });

        // Redirect or perform other actions after successful login
        window.location.href = "./main";
      }
    } catch (error) {
      console.error("Error logging in:", error.message);
    }
  };

  const handleChange = (e) => {
    setFormdata({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <HelmetProvider>
      <Container>
        <Helmet>
          <meta charSet="utf-8" />
          <title>{meta.title} | LoginSignUp</title>
          <meta name="description" content={meta.description} />
        </Helmet>
        <Row className="mb-5 mt-3 pt-md-3">
          <Col lg="8">
            <h1 className="display-4 mb-4">Login</h1>
            <hr className="t_border my-4 ml-0 text-left" />
          </Col>
        </Row>
        <Row className="sec_sp">
          <Col lg="12">
            <Alert
              variant={formData.variant}
              className={`rounded-0 co_alert ${formData.show ? "d-block" : "d-none"}`}
              onClose={() => setFormdata({ ...formData, show: false })}
              dismissible
            >
              <p className="my-0">{formData.alertmessage}</p>
            </Alert>
          </Col>
          <Col lg="7" className="d-flex align-items-center">
            <form onSubmit={handleSubmit} className="contact__form w-100">
              <Row>
                <Col lg="10" className="form-group">
                  <input
                    className="form-control rounded-0"
                    id="email"
                    name="email"
                    placeholder="Email"
                    type="email"
                    value={formData.email || ""}
                    required
                    onChange={handleChange}
                  />
                </Col>
                <Col lg="10" className="form-group">
                  <input
                    className="form-control rounded-0"
                    id="password"
                    name="password"
                    placeholder="Password"
                    type="password"
                    value={formData.password || ""}
                    required
                    onChange={handleChange}
                  />
                </Col>
              </Row>
              <Row>
                <Col lg="12" className="form-group">
                  <Button className="btn ac_btn" type="submit" disabled={formData.loading}>
                    {formData.loading ? "Logging in..." : "Login"}
                  </Button>
                </Col>
              </Row>
              <p style={{ marginTop: "10px" }}>
                Don't have an account? <Link to="/signup" style={{ textDecoration: "underline" }}>Sign up</Link>
              </p>
            </form>
          </Col>
        </Row>
      </Container>
      <div className={formData.loading ? "loading-bar" : "d-none"}></div>
    </HelmetProvider>
  );
};
