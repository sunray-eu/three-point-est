export const mapStateToProps = state => ({
    tasks: state.tasks.tasks,
    tasksOrder: state.tasks.tasksOrder,
    config: state.config,
    groups: state.groups.groups,
    groupsOrder: state.groups.groupsOrder,
    phases: state.phases.phases,
    phasesOrder: state.phases.phasesOrder
});
