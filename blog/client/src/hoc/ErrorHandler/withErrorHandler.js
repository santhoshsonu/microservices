import React, { Component } from 'react';

import CustomizedSnackbar from '../../components/UI/SnackBar/SnackBar';
import Auxiliary from '../Auxiliary';

const withErrorHanlder = (WrappedCompenent, axiosInstance) => {

    return class extends Component {
        constructor() {
            super();
            this.state = {
                error: null,
                snackBarOpen: false
            }
            this.reqInterceptor = axiosInstance.interceptors.request.use(req => {
                this.setState({ error: null, snackBarOpen: false });
                return req;
            });

            this.resInterceptor = axiosInstance.interceptors.response.use(res => res,
                error => {
                    if (!axiosInstance.isCancel(error))
                        this.setState({ error: error, snackBarOpen: true });
                    return Promise.reject(error);
                });
        }

        componentWillUnmount() {
            axiosInstance.interceptors.request.eject(this.reqInterceptor);
            axiosInstance.interceptors.response.eject(this.resInterceptor);
        }

        handleSnackBarClose = (_, reason) => {
            if (reason === 'clickaway') {
                return;
            }
            this.setState({ snackBarOpen: false });
        };

        errorAlert = (msg) => (
            <CustomizedSnackbar
                severity='error'
                open={this.state.snackBarOpen}
                snackBarCloseHandler={this.handleSnackBarClose}>
                {msg}
            </CustomizedSnackbar>
        );

        render() {
            return (
                <Auxiliary>
                    {this.state.error ? this.errorAlert(this.state.error.message) : null}
                    <WrappedCompenent {...this.props} />
                </Auxiliary>

            );
        }

    };

}

export default withErrorHanlder;
