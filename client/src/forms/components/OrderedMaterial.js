import React, { useEffect, useState } from 'react';
import {
  Button,
  FormControl,
  Grid,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import { useToasts } from 'react-toast-notifications';

import OrderedMaterialTable from './OrderedMaterialTable';
import axiosInstance from '../../helpers/axiosInstance';
import OrderedMaterialValidator from '../utils/OrderedMaterialValidator';

const useStyles = makeStyles(() => ({
  button: {
    borderRadius: 0,
  },
  formControl: {
    width: '100%',
  },
  numberInput: {
    '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },
  },
}));

export default function OrderedMaterial() {
  const classes = useStyles();
  const { addToast } = useToasts();

  const [orderedMaterials, setOrderedMaterials] = useState([]);
  const [availableMaterials, setAvailableMaterials] = useState([]);
  const [material, setMaterial] = useState('');
  const [approxCost, setApproxCost] = useState(0);
  const [units, setUnits] = useState(0);
  const [errors, setErrors] = useState({});

  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      axiosInstance.get('/api/store').then((data) => {
        setAvailableMaterials(data.data.data);
      });

      setOrderedMaterials([]);
      setMaterial('');
      setApproxCost(0);
      setUnits(0);
      setErrors([]);
    };
    getData();
  }, []);

  useEffect(() => {
    if (error)
      addToast(error, {
        appearance: 'error',
        autoDismiss: true,
      });
    setError(null);
  }, [error]);

  const resetForm = () => {
    setMaterial('');
    setUnits(0);
    setApproxCost(0);
    setErrors({});
  };

  const isMaterialExists = (array, value) => {
    const count = array.reduce(
      (acc, item) => (item.material === value ? ++acc : acc),
      0
    );
    return count > 0;
  };

  const addHandler = () => {
    OrderedMaterialValidator()
      .validate({
        material,
        approxCost,
        units,
      })
      .then(
        async () => {
          try {
            const isAdded = isMaterialExists(orderedMaterials, material.trim());
            const isInStore = isMaterialExists(
              availableMaterials,
              material.trim()
            );
            if (isAdded) {
              setErrors({
                material: ['Material already Added'],
              });
              return;
            }
            if (isInStore) {
              setErrors({
                material: ['Available in Store'],
              });
              return;
            }

            const queryData = {
              complaintId: '606d41353d209d69f01717e5',
              type: 'ordered',
              sign: 'AO SIGNATURE',

              material: material.trim(),
              approxCost,
              quantity: units,
            };

            const result = await axiosInstance.post('/api/material', queryData);
            if (!result.data.success) throw new Error();

            const doc = result.data.data.orderedMaterial.filter(
              (d) => d.material === material.trim()
            );

            const _id = doc[0]._id;

            if (!result.data.success) throw new Error();
            setOrderedMaterials([
              ...orderedMaterials,
              {
                _id,
                material: material.trim(),
                approxCost,
                units,
              },
            ]);
            setErrors({});
            resetForm();
          } catch (error) {
            try {
              setError(error.response.data.error);
            } catch (error) {
              setError('Unable to add material');
            }
          }
        },
        (error) => {
          setErrors(error.errors);
        }
      );
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4">Ordered By Administrative Officer</Typography>
      </Grid>
      <Grid item md={4} xs={12}>
        <FormControl className={classes.formControl}>
          <TextField
            fullWidth
            required
            autoFocus
            inputProps={{ 'data-testid': 'material' }}
            label="Material Issued"
            size="small"
            value={material}
            onChange={(event) => setMaterial(event.target.value)}
            error={!!errors.material}
            helperText={errors.material ? errors.material[0] : ' '}
          />
        </FormControl>
      </Grid>
      <Grid item md={3} xs={12}>
        <FormControl className={classes.formControl}>
          <TextField
            className={classes.numberInput}
            type="number"
            fullWidth
            required
            autoFocus
            InputLabelProps={{ shrink: true }}
            inputProps={{ 'data-testid': 'cost' }}
            label="Approx Cost"
            size="small"
            value={approxCost}
            onChange={(event) => setApproxCost(event.target.value)}
            error={!!errors.approxCost}
            helperText={errors.approxCost ? errors.approxCost[0] : ' '}
          />
        </FormControl>
      </Grid>
      <Grid item md={3} xs={12}>
        <FormControl className={classes.formControl}>
          <TextField
            className={classes.numberInput}
            type="number"
            fullWidth
            required
            autoFocus
            InputLabelProps={{ shrink: true }}
            inputProps={{ 'data-testid': 'units' }}
            label="Units"
            size="small"
            value={units}
            onChange={(event) => setUnits(event.target.value)}
            error={!!errors.units}
            helperText={errors.units ? errors.units[0] : ' '}
          />
        </FormControl>
      </Grid>
      <Grid item xs={2}>
        <Button
          className={classes.button}
          type="submit"
          fullWidth
          size="large"
          color="secondary"
          variant="contained"
          onClick={addHandler}
        >
          Add
        </Button>
      </Grid>
      <Grid item xs={12} style={{ marginTop: '2px' }}>
        <OrderedMaterialTable
          orderedMaterials={orderedMaterials}
          availableMaterials={availableMaterials}
          setOrderedMaterials={setOrderedMaterials}
          type="ordered"
        />
      </Grid>
    </Grid>
  );
}
