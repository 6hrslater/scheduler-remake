import React from "react";
import "components/Application.scss";
import "components/DayList";
import DayList from "components/DayList";
import Appointment from "components/Appointments";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors.js";
import useApplicationData from "../hooks/useApplicationData"

export default function Application(props) {
  const {
    state,
    setDay,
    bookInterview,
    cancelInterview
  } = useApplicationData();

  const dailyAppointments = getAppointmentsForDay(state, state.day);
  const schedule = dailyAppointments.map((appointment) => {
    const interview = getInterview(state, appointment.interview);
    const interviewersByDay = getInterviewersForDay(state, state.day);
    console.log("string 2", interviewersByDay)
    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        interviewers={interviewersByDay}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}

      />
    );
  }).concat((<Appointment key="last" time="5pm" />
  ));



  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            day={state.day}
            setDay={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {schedule
        }
      </section>
    </main>
  );
}
