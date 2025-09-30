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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { format } from "date-fns";

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] === undefined) return -1;
    if (a[orderBy] === undefined) return 1;
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

const headCells = [
    { id: "avatar", label: "" },
    { id: "email", label: "Email" },
    { id: "uid", label: "UID" },
    { id: "signupTime", label: "Signup Time" },
];

const UsersList = () => {
    const [users, setUsers] = useState(null);
    const [loading, setLoading] = useState(true);

    // Table state
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("email");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // filter
    const [filter, setFilter] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const snap = await getDocs(collection(db, "users"));
                const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
                setUsers(list);
            } catch (err) {
                console.error("Failed to load users:", err);
                setUsers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleRequestSort = (event, property) => {
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

    const filtered = useMemo(() => {
        if (!users) return [];
        const q = filter.trim().toLowerCase();
        if (!q) return users;
        return users.filter((u) => (u.email || "").toLowerCase().includes(q));
    }, [users, filter]);

    const sorted = useMemo(() => {
        const comp = getComparator(order, orderBy);
        const stabilized = filtered.map((el, index) => [el, index]);
        stabilized.sort((a, b) => {
            const orderResult = comp(a[0], b[0]);
            if (orderResult !== 0) return orderResult;
            return a[1] - b[1];
        });
        return stabilized.map((el) => el[0]);
    }, [filtered, order, orderBy]);

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, sorted.length - page * rowsPerPage);

    return (
        <Box sx={{ p: 3 }}>
            <Paper sx={{ width: "100%", mb: 2, p: 1 }}>
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
                        <TextField
                            variant="outlined"
                            size="small"
                            placeholder="Search by email..."
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <IconButton size="small" sx={{ mr: -1 }}>
                                        <SearchIcon />
                                    </IconButton>
                                ),
                            }}
                        />
                    </Box>
                </Toolbar>

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
                        <TableContainer>
                            <Table sx={{ minWidth: 700 }}>
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
                                    {sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                        const ts = row.signupTime;
                                        let signupText = "";
                                        if (ts && ts.seconds) {
                                            signupText = format(new Date(ts.seconds * 1000), "PPpp");
                                        } else if (ts && ts.toDate) {
                                            signupText = format(ts.toDate(), "PPpp");
                                        }
                                        return (
                                            <TableRow hover key={row.id}>
                                                <TableCell align="center" sx={{ width: 72 }}>
                                                    <Avatar sx={{ bgcolor: "#1976d2", width: 40, height: 40 }}>
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
