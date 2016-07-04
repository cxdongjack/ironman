FROM registry.aliyuncs.com/ironman/env

# install 
RUN bash cd $APP_SOURCE_DIR && \
    git pull && git submodule update && \
		bash $BUILD_SCRIPTS_DIR/build-meteor.sh

# switch to production meteor bundle
WORKDIR $APP_BUNDLE_DIR/bundle

# 80 is the default meteor production port, while 3000 is development mode
EXPOSE 80

# start mongo and reaction
ENTRYPOINT ["./entrypoint.sh"]
CMD []
