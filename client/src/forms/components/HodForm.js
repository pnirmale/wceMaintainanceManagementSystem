import React, {useState} from 'react';
import {
    Button,
    FormControl,
    Grid,
    FormGroup,
    FormControlLabel,
    Radio,
    FormLabel,
    Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    button: {
        borderRadius: 0,
        width: '60%'
    },
    acceptBtn: {
        backgroundColor: 'green', 
        color: 'white',
		"&:hover": {
			backgroundColor: "#006400"
		}
    },
    rejectBtn: {
        backgroundColor: 'red', 
        color: 'white',
		"&:hover": {
			backgroundColor: "#CD0000"
		}
    },
    marginTop: {
        margin: theme.spacing(2,0),
    }
}));

export default function HodForm({ rejectHandler }){
    const classes = useStyles();

    const [fundSource, setFundSource] = useState('');
    const [errors, setErrors] = useState({});

    const handleChange = (event) => {
        setFundSource(event.target.value);
    }

    const checkEmpty = () => {
        var errors = {};

        if(fundSource === ''){
            errors['fundSource'] = ['Please Select a Fund Source'];
        }

        const success = !Object.keys(errors).length;
        const validationResult = {
            success: !Object.keys(errors).length,
            errors: errors,
        };

        return success ? Promise.resolve(validationResult) : Promise.reject(validationResult);
    }

    const submitHandler = (event) => {
        event.preventDefault();

        checkEmpty()
        .then(() => {
            setErrors({})
        }, (err) => {
            setErrors(err.errors)
        });
    }

    return(
        <form className='hod-form'>
            <FormControl>
                <Grid container>
                    <Grid item xs={12}>
                        <FormLabel component='h1' required error={!!errors.fundSource}>
                            Source of Fund
                        </FormLabel>
                    </Grid>
                    <FormGroup>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Radio
                                        value='Diploma'
                                        checked={fundSource === 'Diploma'} 
                                        onChange={handleChange} 
                                        name="Diploma" 
                                    />
                                }
                                label="Diploma"
                            />
                            <FormControlLabel
                                control={
                                    <Radio
                                        value='UG'
                                        checked={fundSource === 'UG'} 
                                        onChange={handleChange} 
                                        name="UG" 
                                    />
                                }
                                label="UG"
                            />
                            <FormControlLabel
                                control={
                                    <Radio
                                        value='PG'
                                        checked={fundSource === 'PG'} 
                                        onChange={handleChange} 
                                        name="PG" 
                                    />
                                }
                                label="PG"
                            />
                            <FormControlLabel
                                control={
                                    <Radio
                                        value='Lab'
                                        checked={fundSource === 'Lab'} 
                                        onChange={handleChange} 
                                        name="Lab" 
                                    />
                                }
                                label="Lab"
                            />
                            <FormControlLabel
                                control={
                                    <Radio
                                        value='Other'
                                        checked={fundSource === 'Other'} 
                                        onChange={handleChange} 
                                        name="Other" 
                                    />
                                }
                                label="Other"
                            />
                        </Grid>
                        <Typography
                            variant="subtitle2"
                            color="error"
                            data-testid="non-field-errors"
                        >
                            {errors['fundSource'] ? errors['fundSource'][0] : ' '}
                        </Typography>
                    </FormGroup>
                </Grid>
            </FormControl>
            <Grid container spacing={1} className={classes.marginTop}>
                <Grid item md={4} xs={8}>
                    <Button
                        className={[classes.button, classes.rejectBtn].join(' ')}
                        size="large"
                        variant="contained"
                        onClick={rejectHandler}
                    >
                        Reject Complaint
                    </Button>
                </Grid>
                <Grid item md={4} xs={4}>
                    <Button
                        className={[classes.button, classes.acceptBtn].join(' ')}
                        type="submit"
                        size="large"
                        variant="contained"
                        onClick={submitHandler}
                    >
                        Submit
                    </Button>
                </Grid>
            </Grid>
        </form>
    )
}
