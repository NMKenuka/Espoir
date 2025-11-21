

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { login, register, clearError } from '../store/authSlice';
import { loginSchema, registerSchema } from '../utils/validation';
import { lightTheme, darkTheme } from '../styles/theme';
import LoadingSpinner from '../components/LoadingSpinner';

const AuthScreen = () => {
  const dispatch = useDispatch();
  const { loading, error, isDarkMode } = useSelector(state => state.auth);
  const theme = isDarkMode ? darkTheme : lightTheme;

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = async () => {
    try {
      const schema = isLogin ? loginSchema : registerSchema;
      await schema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      const validationErrors = {};
      err.inner.forEach(error => {
        validationErrors[error.path] = error.message;
      });
      setErrors(validationErrors);
      return false;
    }
  };

  const handleSubmit = async () => {
    const isValid = await validateForm();
    if (!isValid) return;

    try {
      if (isLogin) {
        await dispatch(login({
          email: formData.email,
          password: formData.password,
        })).unwrap();
      } else {
        await dispatch(register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        })).unwrap();
      }
    } catch (err) {
      Alert.alert('Error', err.message || 'Authentication failed');
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    dispatch(clearError());
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Film stroke={theme.primary} width={60} height={60} />
          <Text style={[styles.logo, { color: theme.primary }]}>StreamBox</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Your Entertainment Hub
          </Text>
        </View>

        {/* Form */}
        <View style={[styles.formContainer, { backgroundColor: theme.card }]}>
          <Text style={[styles.title, { color: theme.text }]}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </Text>

          {!isLogin && (
            <>
              <View style={styles.inputContainer}>
                <User stroke={theme.textSecondary} width={20} height={20} />
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="Username"
                  placeholderTextColor={theme.textSecondary}
                  value={formData.username}
                  onChangeText={(text) => handleChange('username', text)}
                  autoCapitalize="none"
                />
              </View>
              {errors.username && (
                <Text style={styles.errorText}>{errors.username}</Text>
              )}
            </>
          )}

          <View style={styles.inputContainer}>
            <Mail stroke={theme.textSecondary} width={20} height={20} />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Email"
              placeholderTextColor={theme.textSecondary}
              value={formData.email}
              onChangeText={(text) => handleChange('email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          {errors.email && (
            <Text style={styles.errorText}>{errors.email}</Text>
          )}

          <View style={styles.inputContainer}>
            <Lock stroke={theme.textSecondary} width={20} height={20} />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Password"
              placeholderTextColor={theme.textSecondary}
              value={formData.password}
              onChangeText={(text) => handleChange('password', text)}
              secureTextEntry
            />
          </View>
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}

          {!isLogin && (
            <>
              <View style={styles.inputContainer}>
                <Lock stroke={theme.textSecondary} width={20} height={20} />
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="Confirm Password"
                  placeholderTextColor={theme.textSecondary}
                  value={formData.confirmPassword}
                  onChangeText={(text) => handleChange('confirmPassword', text)}
                  secureTextEntry
                />
              </View>
              {errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}
            </>
          )}

          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>
              {isLogin ? 'Login' : 'Register'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleMode}>
            <Text style={[styles.toggleText, { color: theme.textSecondary }]}>
              {isLogin
                ? "Don't have an account? Register"
                : 'Already have an account? Login'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 5,
  },
  formContainer: {
    borderRadius: 16,
    padding: 24,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
    height: 50,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  errorText: {
    color: '#E50914',
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 4,
  },
  button: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggleText: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
  },
});

export default AuthScreen;