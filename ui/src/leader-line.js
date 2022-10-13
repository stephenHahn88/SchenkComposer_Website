import LeaderLine from "leader-line"

export default {
    setLine: (start, end, config = {}) => new LeaderLine(start, end, config),
    obj: LeaderLine
};