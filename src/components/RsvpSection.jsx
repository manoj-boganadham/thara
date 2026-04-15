import { useState } from 'react';

const initialValues = {
  name: '',
  attendance: '',
  message: '',
};

function RsvpSection() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('');

  const onChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setStatus('');
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};

    if (!values.name.trim()) {
      nextErrors.name = 'Please enter your name.';
    }

    if (!values.attendance) {
      nextErrors.attendance = 'Please select your response.';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setStatus(
      values.attendance === 'accept'
        ? `Thank you, ${values.name.trim()}! Your joyful response is noted.`
        : `Thank you, ${values.name.trim()}. Your response has been noted with love.`
    );
    setValues(initialValues);
  };

  return (
    <section className="invite-section fade-in" id="rsvp">
      <h2 className="section-heading">Will You Join Us?</h2>
      <div className="section-divider" />
      <form className="rsvp-form" onSubmit={onSubmit} noValidate>
        <label className="form-label" htmlFor="name">
          Your Name
        </label>
        <input
          className="form-input"
          id="name"
          name="name"
          value={values.name}
          onChange={onChange}
          placeholder="Enter your name"
        />
        {errors.name ? <p className="form-error">{errors.name}</p> : null}

        <fieldset className="rsvp-choice-group">
          <legend className="form-label">Will You Attend?</legend>
          <label className="rsvp-choice">
            <input
              type="radio"
              name="attendance"
              value="accept"
              checked={values.attendance === 'accept'}
              onChange={onChange}
            />
            Joyfully Accept
          </label>
          <label className="rsvp-choice">
            <input
              type="radio"
              name="attendance"
              value="decline"
              checked={values.attendance === 'decline'}
              onChange={onChange}
            />
            Respectfully Decline
          </label>
        </fieldset>
        {errors.attendance ? <p className="form-error">{errors.attendance}</p> : null}

        <label className="form-label" htmlFor="message">
          Message (Optional)
        </label>
        <textarea
          className="form-input form-textarea"
          id="message"
          name="message"
          value={values.message}
          onChange={onChange}
          placeholder="Share your blessings"
        />

        <button type="submit" className="primary-btn">
          Confirm Attendance
        </button>

        {status ? <p className="form-success">{status}</p> : null}
      </form>
    </section>
  );
}

export default RsvpSection;
