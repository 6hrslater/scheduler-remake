import React from 'react';
import Header from 'components/Appointments/Header';
import Show from 'components/Appointments/Show';
import Empty from 'components/Appointments/Empty';
import 'components/Appointments/styles.scss';
import useVisualMode from 'hooks/useVisualMode';
import Form from 'components/Appointments/Form';
import Status from 'components/Appointments/Status';
import Confirm from 'components/Appointments/Confirm';
import Error from 'components/Appointments/Error';


export default function Appointment(props) {
    const EMPTY = "EMPTY";
    const SHOW = "SHOW";
    const CREATE = "CREATE";
    const SAVING = "SAVING";
    const DELETING = "DELETING";
    const CONFIRM = "CONFIRM";
    const EDIT = "EDIT";
    const ERROR_SAVE = "ERROR_SAVE";
    const ERROR_DELETE = "ERROR_DELETE"

    const { mode, transition, back } = useVisualMode(
        props.interview ? SHOW : EMPTY
    );
    function save(name, interviewer) {
        const interview = {
            student: name,
            interviewer
        };
        transition(SAVING)
        props.bookInterview(props.id, interview)
            .then(() => transition(SHOW)
            ).catch(function (error) { transition(ERROR_SAVE, true) })
    }

    function deleteAppt() {
        transition(CONFIRM);
    }

    function confirmDeleteAppt() {
        transition(DELETING, true);
        props
            .cancelInterview(props.id)
            .then(() => transition(EMPTY))
            .catch(function (error) { transition(ERROR_DELETE, true) });
    }

    function edit() {
        transition(EDIT);
    }

    console.log("interviewers", props.interviewer)
    return (
        <article className="appointment">
            <Header
                time={props.time}
            />
            {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
            {mode === SAVING && <Status message="Saving" />}
            {mode === SHOW && (
                <Show
                    student={props.interview.student}
                    interviewer={props.interview.interviewer}
                    onEdit={edit}
                    onDelete={deleteAppt}
                />
            )}
            {mode === CREATE && (
                <Form
                    interviewers={props.interviewers}
                    onSave={save}
                    onCancel={() => back(EMPTY)}
                />
            )}
            {mode === CONFIRM && (
                <Confirm
                    message={"Are you sure you would like to delete?"}
                    onConfirm={confirmDeleteAppt}
                    onCancel={() => back()}
                />
            )}

            {mode === DELETING && (
                <Status
                    message={DELETING}
                />
            )}
            {mode === EDIT && (
                <Form
                    name={props.interview.student}
                    interviewer={props.interview.interviewer.id}
                    interviewers={props.interviewers}
                    onCancel={() => back()}
                    onSave={save}
                />
            )}{mode === ERROR_SAVE && (
                <Error
                    message={"Could not save message. Please try again."}
                    onClose={back}
                />
            )}
            {mode === ERROR_DELETE && (
                <Error
                    message={"Could not delete message. Please try again."}
                    onClose={back}
                />
            )}

        </article>
    );
}