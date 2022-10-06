import Chip from "@mui/material/Chip";

export function Pill(props) {
    const getSeverity = (severity) => {
        switch (severity) {
            case "critical":
                return "red";
            case "high":
                return "orangered";
            case "medium":
                return "orange";
            case "medium":
                return "gray";
            default:
                return "gray";
        }
    }
    const severityColor = getSeverity(props.severity);
    return (
        <Chip
            variant="outlined"
            label={props.severity}
            sx={{
                borderRadius: '15px',
                fontSize: '.8rem',
                fontWeight: 600,
                padding: '2px',
                width: '100px',
                minWidth: '100px',
                borderColor: severityColor,
                color: severityColor,
                marginRight: '1rem',
            }} />
    )
}