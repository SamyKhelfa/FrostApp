import { FC } from "react";
import { ScrollView, StyleProp, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ScreenProps {
    children: React.ReactNode;
    paddingTop?: boolean;
    paddingBottom?: boolean;
    style?: StyleProp<ViewStyle>;
    paddingHorizontal?: boolean;
    scrollEnabled?: boolean;
}

export const Screen: FC<ScreenProps> = ({
                                            children,
                                            paddingTop = true,
                                            paddingBottom = false,
                                            paddingHorizontal = false,
                                            scrollEnabled = false,
                                            style = {},
                                        }) => {
    const insets = useSafeAreaInsets();

    const containerStyle = {
        flex: 1,
        paddingTop: paddingTop ? insets.top + 8 : 0,
        paddingBottom: paddingBottom ? insets.bottom + 32 : 0,
        paddingHorizontal: paddingHorizontal
            ? 16
            : 0,
        ...(style as any),
    };

    if (scrollEnabled) {
        return (
            <ScrollView
                style={containerStyle}
                contentContainerStyle={[
                    {
                        flexGrow: 1,
                        paddingBottom: paddingBottom
                            ? 34
                            : 0,
                    },
                    style as any,
                ]}
                showsVerticalScrollIndicator={false}
            >
                {children}
            </ScrollView>
        );
    }

    return <View style={containerStyle}>{children}</View>;
};