import React, { useState } from 'react';
import * as Yup from 'yup'
import { Formik, Form, Field } from 'formik'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import course from './utilities/courses';
import moment from 'moment'


function SignupForm() {


  const [signupForm, setSignupForm] = useState({
    courseId: 0,
    subjects: [],
    date: new Date(),
    additionalNote: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const [courses, setCourses] = useState(course);

  //validation Scehma for sign up form
  const validationSchema = Yup.object({
    courseId: Yup.number().min(1, 'Please Select Course'),
    subjects: Yup.array().required('Please Select Subject'),
    date: Yup.string()
      .test(
        'not empty',
        'Your selected course and subject is not offered beginning from your selected date',
        function (value) {
          var formatedValue = moment.utc(value).format('D/MM/YYYY')
          var validDate1 = moment.utc('20 Dec 2019').format('D/MM/YYYY')
          var validDate2 = moment.utc('15 Jan 2020').format('D/MM/YYYY')
          var validDate3 = moment.utc('1 Feb 2020').format('D/MM/YYYY')

          if (formatedValue === validDate1 || formatedValue === validDate2 || formatedValue === validDate3) { return true; }
          else { return false };
        }
      ),
    additionalNote: Yup.string().test(
      'not empty',
      'Additional Note should either be Empty or between 20 to 500 Words',
      function (value) {
        if (!value || (value.length >= 20 && value.length <= 500)) {
          return true;
        }
        else { return false };
      }
    ),
  })

  //when course is selected
  const onCourseChange = (course, values, setFieldValue) => {
    setFieldValue('courseId', course.courseId);
    setFieldValue('subjects', []);
  }


  //when any project is selected/unselected
  const onSubjectChange = (e, subject, values, setFieldValue) => {
    var subjects = values.subjects;
    if (e.target.checked) {
      subjects.push(subject.subjectId)
    }
    else {
      var index = subjects.indexOf(subject.subjectId);
      if (index !== -1) subjects.splice(index, 1);
    }
    setFieldValue('subjects', subjects);
  }

  //datepicker html
  const DatePickerField = ({ name, value, onChange }) => {
    return (
      <DatePicker
        selected={(value && new Date(value)) || null}
        onChange={val => {
          onChange(name, val);
        }}
      />
    );
  };

  //on form submit
  const signup = (values, actions) => {
    setIsLoading(true);
    setTimeout(() => {
      alert('Your course has been successfully registered.')
      setSignupForm({
        courseId: 0,
        subjects: [],
        date: new Date(),
        additionalNote: '',
      })
      setIsLoading(false);
    }, 2000);
  }

  return (
    <div className="App">
      <div class="pen-title">
        <h1>SignUp Form</h1>
      </div>
      {/* Form Starts here */}
      <Formik
        enableReinitialize
        initialValues={signupForm}
        onSubmit={(values, actions) => signup(values, actions)}
        validationSchema={validationSchema} >
        {({ touched, values, errors, setFieldValue }) => (
          <Form>

            <h4 ><span className="underline">Course</span> *</h4>
            {courses.map((course, index) => {
              return (<div className="course " key={index}>
                < input id={course.courseId} type="radio" name="course" onChange={() => onCourseChange(course, values, setFieldValue)} />
                <label for={course.courseId}>{course.courseTitle}</label>

                {course.courseId === values.courseId && (<div className="subject">
                  <h5 className="bold"> <span className="underline">Subject</span> *</h5>
                  {course.subjects.map((subject, subIndex) =>
                    <div key={subIndex}>
                      <input type="checkBox" id={subject.subjectId} name="subject" onChange={(e) => onSubjectChange(e, subject, values, setFieldValue)} />
                      <label for={subject.subjectId}> {subject.subjectTitle}</label>
                    </div>
                  )}
                  {errors.subjects && touched.subjects && (
                    <div className="mt-1 alert alert-danger">{errors.subjects}</div>
                  )}
                </div>)}

              </div>)
            })}
            <div className="clearfix"></div>
            {errors.courseId && touched.courseId && (
              <div className="mt-1 alert alert-danger">{errors.courseId}</div>
            )}

            <h4 className="mt-3"><span className="underline">Course Date</span> *</h4>
            <div className="input-controls">
              <DatePickerField
                name="date"
                value={values.date}
                onChange={setFieldValue}
              />
              {errors.date && touched.date && (
                <div className="mt-1 alert alert-danger">{errors.date}</div>
              )}

              <div className="mt-4">
                <h4><span className="underline">Any Addition Notes</span></h4>
                <Field
                  component="textarea"
                  id="additionalNote"
                  name="additionalNote"
                  autoFocus={!values.id}
                  placeholder="Additional Note"
                  autoComplete="off"
                  className="a-text-input"
                />
                {errors.additionalNote && (
                  <div className="mt-1 alert alert-danger">{errors.additionalNote}</div>
                )}
              </div>
            </div>

            {isLoading && <button class="btn btn-primary" type="button" disabled>
              <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              <span className="padding-left15">Signup </span>
            </button>}
            {!isLoading && <button type="submit" class="btn btn-primary">
              Signup
            </button>}


          </Form>
        )}
      </Formik>
    </div >
  );
}

export default SignupForm;
