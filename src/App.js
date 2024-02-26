import React, { useState } from 'react';
import './App.css';

function App() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const [showOtpField, setShowOtpField] = useState(false); // To toggle OTP input visibility
    const [isPhoneNumberSubmitted, setIsPhoneNumberSubmitted] = useState(false); // To disable phone number input
    const [hasAcknowledgedText, setHasAcknowledgedText] = useState(false); // New state variable

    const handleAcknowledgment = () => {
        setHasAcknowledgedText(true); // User has acknowledged the text
    };

    const handlePhoneNumberChange = (event) => {
        setPhoneNumber(event.target.value);
    };

    const handleOtpChange = (event) => {
        const value = event.target.value;
        // Only update if the input is empty or contains only numbers, and is 6 digits or less
        if (value === '' || (value.match(/^\d{0,6}$/) && value.length <= 6)) {
            setOtp(value);
        }
    };

    const handleSubmitPhoneNumber = async (event) => {
        event.preventDefault();
        const apiEndpoint = `https://7vt4is08ae.execute-api.us-east-1.amazonaws.com/dev/send_otp?phone_num=1${phoneNumber}`;

        try {
            const response = await fetch(apiEndpoint);
            if (response.ok) {
                setMessage('OTP sent successfully. Please verify the OTP.');
                setShowOtpField(true); // Show OTP input field
                setIsPhoneNumberSubmitted(true); // Disable phone number input
            } else {
                setMessage('Failed to send OTP. Please try again.');
            }
        } catch (error) {
            setMessage('An error occurred. Please try again.');
        }
    };

    const handleSubmitOtp = async (event) => {
        event.preventDefault();
        const apiEndpoint = `https://7vt4is08ae.execute-api.us-east-1.amazonaws.com/dev/verify_otp?phone_num=1${phoneNumber}&otp=${otp}`;

        try {
            const response = await fetch(apiEndpoint);
            const data = await response.text();

            if (response.ok) {
                setMessage(data);
                // Perform further actions as needed
            } else {
                setMessage(`An error occurred while attempting to verify the OTP. Please try again.`);
            }
        } catch (error) {
            setMessage('An error occurred while verifying the OTP. Please try again.');
        }
    };

    const handleReset = () => {
        // Reset all state variables to their initial values
        setPhoneNumber('');
        setOtp('');
        setMessage('');
        setShowOtpField(false);
        setIsPhoneNumberSubmitted(false);
        setHasAcknowledgedText(false); // Reset acknowledgment
    };

    // Dynamically set the message style based on its content
    const messageStyle = {
        color: message === 'Customer Verified' ? 'green' : 'red',
        fontWeight: 'bold',
        marginTop: '20px',
    };

    return (
        <div className="App">
            <header className="App-header">
                <div>
                    <p>Question for the customer:</p><p>Do I have your permission to send you a one time passcode via text message to the mobile phone we have on record?</p>
                    <button onClick={handleAcknowledgment} disabled={hasAcknowledgedText}>Customer Agrees</button>
                    <br></br>
                </div>
                {hasAcknowledgedText && (
                    <form onSubmit={handleSubmitPhoneNumber}>
                        <br></br>
                        <label htmlFor="phone-number">Phone Number: </label>
                        <input
                            type="tel"
                            id="phone-number"
                            name="phone-number"
                            pattern="\d{10}"
                            title="Phone number should be 10 digits"
                            value={phoneNumber}
                            onChange={handlePhoneNumberChange}
                            required
                            disabled={isPhoneNumberSubmitted} // Disable input based on state
                        />
                        {!showOtpField && <button type="submit">Send OTP</button>}
                        <br></br>
                    </form>
                )}
                {showOtpField && (
                    <form onSubmit={handleSubmitOtp}>
                        <label htmlFor="otp">OTP: </label>
                        <input
                            type="text"
                            id="otp"
                            name="otp"
                            pattern="\d{6}"
                            title="OTP should be 6 digits"
                            value={otp}
                            onChange={handleOtpChange}
                            required
                        />
                        <button type="submit">Verify OTP</button>
                        <br></br>
                    </form>
                )}
                {hasAcknowledgedText && (
                    <div>
                        <br></br>
                        <button onClick={handleReset}>Reset Form</button>
                    </div>
                )}
                {message && <p style={messageStyle}>{message}</p>}
            </header>
        </div>
    );
}

export default App;