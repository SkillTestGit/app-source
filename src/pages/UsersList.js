import React, { useEffect, useMemo, useState } from "react";
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    TablePagination,
    Toolbar,
    Typography,
    TextField,
    IconButton,
    CircularProgress,
    Avatar,
    SvgIcon,
} from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { format } from "date-fns";

/*
  UsersList.jsx
  - Fetches all documents from Firestore "users" collection.
  - Displays them in a professional, paginated, sortable table.
  - Includes client-side search (by email), sorting and pagination.
  - Uses SvgIcon so it doesn't depend on @mui/icons-material package.
*/

/* Helpers for sorting the table rows */
function descendingComparator(a, b, orderBy) {
    // Handle undefined values gracefully so sorting won't throw.
    if (b[orderBy] === undefined) return -1;
    if (a[orderBy] === undefined) return 1;
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    return 0;
}
function getComparator(order, orderBy) {
    return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

/* Table columns definition */
const headCells = [
    { id: "avatar", label: "" },
    { id: "email", label: "Email" },
    { id: "uid", label: "UID" },
    { id: "signupTime", label: "Signup Time" },
];

/* Inline SearchSvgIcon: avoids needing @mui/icons-material */
const SearchSvgIcon = (props) => (
    <SvgIcon {...props}>
        {/* Standard 'search' path from Material icons (keeps bundle small & independent) */}
        <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79L20 20.49 21.49 19l-5.99-5zM10 15a5 5 0 110-10 5 5 0 010 10z" />
    </SvgIcon>
);

const UsersList = () => {
    // Firestore data
    const [users, setUsers] = useState(null);
    const [loading, setLoading] = useState(true);

    // Table UI state: ordering, pagination
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("email");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Filter state
    const [filter, setFilter] = useState("");

    // Fetch users
    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                // Read all docs from "users" collection
                const snap = await getDocs(collection(db, "users"));
                // Map documents to plain objects (id + data)
                const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
                setUsers(list);
            } catch (err) {
                // Log and set empty so UI can render "no users"
                console.error("Failed to load users:", err);
                setUsers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
        // Empty deps
    }, []);

    /* Event handlers for table behavior */
    const handleRequestSort = (event, property) => {
        // Toggle between asc/desc for a column
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    /*
      Filtering and sorting are done with useMemo to avoid expensive recalculation
      on every render. They only recompute when dependent inputs change.
    */
    const filtered = useMemo(() => {
        if (!users) return [];
        const q = filter.trim().toLowerCase();
        if (!q) return users;
        return users.filter((u) => (u.email || "").toLowerCase().includes(q));
    }, [users, filter]);

    const sorted = useMemo(() => {
        const comp = getComparator(order, orderBy);
        // Stabilize sort to maintain order for equal values
        const stabilized = filtered.map((el, index) => [el, index]);
        stabilized.sort((a, b) => {
            const orderResult = comp(a[0], b[0]);
            if (orderResult !== 0) return orderResult;
            return a[1] - b[1];
        });
        return stabilized.map((el) => el[0]);
    }, [filtered, order, orderBy]);

    // Compute number of empty rows to keep table height stable on last page
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, sorted.length - page * rowsPerPage);

    return (
        <Box sx={{ p: 3 }}>
            <Paper sx={{ width: "100%", mb: 2, p: 1 }}>
                {/* Toolbar: title + search */}
                <Toolbar
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2,
                        flexWrap: "wrap",
                    }}
                >
                    <Typography variant="h6" component="div">
                        Registered Users
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {/* Search field: small and client-side */}
                        <TextField
                            variant="outlined"
                            size="small"
                            placeholder="Search by email..."
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <IconButton size="small" sx={{ mr: -1 }}>
                                        <SearchSvgIcon />
                                    </IconButton>
                                ),
                            }}
                        />
                    </Box>
                </Toolbar>

                {/* Loading / Empty / Table states */}
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : sorted.length === 0 ? (
                    <Box sx={{ p: 4 }}>
                        <Typography>No users found.</Typography>
                    </Box>
                ) : (
                    <>
                        {/* Table with sortable headers */}
                        <TableContainer>
                            <Table sx={{ minWidth: 1300 }}>
                                <TableHead>
                                    <TableRow>
                                        {headCells.map((headCell) => (
                                            <TableCell
                                                key={headCell.id}
                                                align={headCell.id === "avatar" ? "center" : "left"}
                                                sortDirection={orderBy === headCell.id ? order : false}
                                            >
                                                {headCell.id === "avatar" ? (
                                                    headCell.label
                                                ) : (
                                                    <TableSortLabel
                                                        active={orderBy === headCell.id}
                                                        direction={orderBy === headCell.id ? order : "asc"}
                                                        onClick={(e) => handleRequestSort(e, headCell.id)}
                                                    >
                                                        {headCell.label}
                                                    </TableSortLabel>
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {/* Render visible rows for current page */}
                                    {sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                        // Firestore may store timestamps as objects with .seconds or as Timestamp with toDate()
                                        const ts = row.signupTime;
                                        let signupText = "";
                                        if (ts && ts.seconds) {
                                            // typical serverTimestamp value returned from Firestore snapshot
                                            signupText = format(new Date(ts.seconds * 1000), "PPpp");
                                        } else if (ts && ts.toDate) {
                                            // alternate Timestamp representation
                                            signupText = format(ts.toDate(), "PPpp");
                                        }
                                        return (
                                            <TableRow hover key={row.id}>
                                                <TableCell align="center" sx={{ width: 72 }}>
                                                    {/* Simple avatar with letter fallback */}
                                                    <Avatar sx={{ bgcolor: "#e4e4e4", width: 40, height: 40 }}>
                                                        {row.email ? row.email.charAt(0).toUpperCase() : "U"}
                                                    </Avatar>
                                                </TableCell>
                                                <TableCell>{row.email}</TableCell>
                                                <TableCell sx={{ maxWidth: 250, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                    {row.uid}
                                                </TableCell>
                                                <TableCell>{signupText}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    {emptyRows > 0 && (
                                        <TableRow style={{ height: 53 * emptyRows }}>
                                            <TableCell colSpan={6} />
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Pagination controls */}
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={sorted.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </>
                )}
            </Paper>
        </Box>
    );
};

export default UsersList;
