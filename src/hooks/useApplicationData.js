import React, { useState, useEffect } from "react";
import axios from "axios";


export default function useApplicationData() {
    const [state, setState] = useState({
        day: "Monday",
        days: [],
        appointments: {},
        interviewers: {},
    });

    const setDay = day => setState({ ...state, day });

    useEffect(() => {
        Promise.all([
            axios.get("/api/days"),
            axios.get("/api/appointments"),
            axios.get("/api/interviewers")
        ]).then(([days, appointments, interviewers]) => {
            setState(prev => {
                return ({
                    ...prev, days: days.data, appointments: appointments.data, interviewers: interviewers.data
                })
            });
        })
    }, []);

    const updatedDays = function (appointments) {
        const currentDay = state.days.find(day => day.name === state.day)
        const currentDayIndex = state.days.findIndex(day => day.name === state.day)
        const spots = currentDay.appointments.filter(appointmentId => appointments[appointmentId].interview === null).length

        const newDays = [...state.days]
        newDays[currentDayIndex] = { ...currentDay, spots }
        return newDays
    }

    function bookInterview(id, interview) {
        const appointment = {
            ...state.appointments[id],
            interview: { ...interview }
        };
        const appointments = {
            ...state.appointments,
            [id]: appointment
        };


        return axios
            .put(`/api/appointments/${id}`, { interview })
            .then(() => setState(prev => ({ ...prev, appointments, days: updatedDays(appointments) })))
    }

    function cancelInterview(id) {

        const appointment = {
            ...state.appointments[id],
            interview: null
        };
        const appointments = {
            ...state.appointments,
            [id]: appointment
        };


        return axios.delete(`/api/appointments/${id}`)
            .then(() => {
                setState(prev => ({ ...prev, appointments, days: updatedDays(appointments) }));
            })

    }
    return { state, setDay, bookInterview, cancelInterview };
}

