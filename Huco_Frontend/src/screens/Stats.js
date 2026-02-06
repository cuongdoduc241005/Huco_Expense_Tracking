import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import Svg, { G, Path, Circle, Text as SvgText } from "react-native-svg";
import MainHeader from "../components/MainHeader";
import { useStatsViewModel } from "../viewmodels/useStatsViewModel";
import DateTimePicker from "@react-native-community/datetimepicker";

const { width } = Dimensions.get("window");
const PIE_RADIUS = width / 3.2;
const PIE_CENTER_X = width / 2;
const PIE_CENTER_Y = PIE_RADIUS + 20;

export default function Stats({ navigation, route }) {
  const user = route.params?.user;
  const {
    isLoading,
    transactionType,
    setTransactionType,
    selectedSliceIndex,
    setSelectedSliceIndex,
    pieData,
    pieTotal,
    date,
    setDate,
    changeMonthBy,
    refreshData,
  } = useStatsViewModel(user);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const createPieSlice = (startAngle, endAngle, radius) => {
    const x1 = PIE_CENTER_X + radius * Math.cos(startAngle);
    const y1 = PIE_CENTER_Y + radius * Math.sin(startAngle);
    const x2 = PIE_CENTER_X + radius * Math.cos(endAngle);
    const y2 = PIE_CENTER_Y + radius * Math.sin(endAngle);
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
    return `M ${PIE_CENTER_X} ${PIE_CENTER_Y} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  const formatCurrency = (amount) =>
    Number(amount)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const THEME_COLOR = transactionType === "EXPENSE" ? "#F44336" : "#00C853";

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9F9F9" />
      <MainHeader user={user} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {/* --- CHỌN THỜI GIAN --- */}
        <View style={styles.dateControlRow}>
          <TouchableOpacity
            onPress={() => changeMonthBy(-1)}
            style={styles.arrowButton}
          >
            <Ionicons name="chevron-back" size={22} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.dateDisplay}
          >
            <Ionicons
              name="calendar-outline"
              size={18}
              color="#1F41BB"
              style={{ marginRight: 10 }}
            />
            <Text
              style={styles.dateText}
            >{`Tháng ${date.getMonth() + 1}, ${date.getFullYear()}`}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => changeMonthBy(1)}
            style={styles.arrowButton}
          >
            <Ionicons name="chevron-forward" size={22} color="#333" />
          </TouchableOpacity>
        </View>

        {/* SWITCHER */}
        <View style={styles.switchWrapper}>
          <View style={styles.switchContainer}>
            <TouchableOpacity
              style={[
                styles.switchBtn,
                transactionType === "EXPENSE" && styles.switchBtnActive,
              ]}
              onPress={() => setTransactionType("EXPENSE")}
            >
              <Text
                style={[
                  styles.switchText,
                  transactionType === "EXPENSE" && { color: "#F44336" },
                ]}
              >
                Chi tiêu
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.switchBtn,
                transactionType === "INCOME" && styles.switchBtnActive,
              ]}
              onPress={() => setTransactionType("INCOME")}
            >
              <Text
                style={[
                  styles.switchText,
                  transactionType === "INCOME" && { color: "#00C853" },
                ]}
              >
                Thu nhập
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* TẠM COMMENT BIỂU ĐỒ XU HƯỚNG THEO YÊU CẦU */}
        {/* <View style={styles.cardContainer}>...</View> */}

        {/* --- PIE CHART SECTION --- */}
        <View style={styles.cardContainer}>
          <Text style={styles.sectionTitle}>Phân tích danh mục</Text>
          {isLoading ? (
            <ActivityIndicator
              size="large"
              color={THEME_COLOR}
              style={{ marginVertical: 50 }}
            />
          ) : pieData.length === 0 ? (
            <Text style={styles.noDataText}>Không có dữ liệu tháng này</Text>
          ) : (
            <>
              <View style={styles.pieContainer}>
                <Svg width={width} height={PIE_RADIUS * 2 + 40}>
                  <G>
                    {pieData.map((slice, index) => (
                      <Path
                        key={index}
                        d={createPieSlice(
                          slice.startAngle,
                          slice.endAngle,
                          selectedSliceIndex === index
                            ? PIE_RADIUS + 10
                            : PIE_RADIUS,
                        )}
                        fill={slice.color}
                        stroke="#FFF"
                        strokeWidth={2}
                        onPress={() =>
                          setSelectedSliceIndex(
                            index === selectedSliceIndex ? null : index,
                          )
                        }
                      />
                    ))}
                    <Circle
                      cx={PIE_CENTER_X}
                      cy={PIE_CENTER_Y}
                      r={PIE_RADIUS * 0.6}
                      fill="#FFF"
                    />
                    <SvgText
                      x={PIE_CENTER_X}
                      y={PIE_CENTER_Y - 5}
                      fill="#666"
                      fontSize="14"
                      textAnchor="middle"
                    >
                      {selectedSliceIndex !== null ? "Chi tiết" : "Tổng cộng"}
                    </SvgText>
                    <SvgText
                      x={PIE_CENTER_X}
                      y={PIE_CENTER_Y + 20}
                      fill="#333"
                      fontSize="18"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {selectedSliceIndex !== null
                        ? formatCurrency(pieData[selectedSliceIndex].amount)
                        : formatCurrency(pieTotal)}
                    </SvgText>
                  </G>
                </Svg>
              </View>

              <View style={styles.listContainer}>
                {pieData.map((item, index) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.rankItem,
                      selectedSliceIndex === index && styles.rankItemActive,
                    ]}
                    onPress={() =>
                      setSelectedSliceIndex(
                        index === selectedSliceIndex ? null : index,
                      )
                    }
                  >
                    <View
                      style={[
                        styles.rankIconBox,
                        { backgroundColor: item.color + "20" },
                      ]}
                    >
                      <FontAwesome5
                        name={item.icon}
                        size={16}
                        color={item.color}
                      />
                    </View>
                    <View style={styles.rankContent}>
                      <View style={styles.rankRow}>
                        <Text style={styles.rankName}>{item.name}</Text>
                        <Text style={styles.rankAmount}>
                          {formatCurrency(item.amount)} ₫
                        </Text>
                      </View>
                      <View style={styles.progressBarBg}>
                        <View
                          style={[
                            styles.progressBarFill,
                            {
                              width: `${item.percent * 100}%`,
                              backgroundColor: item.color,
                            },
                          ]}
                        />
                      </View>
                      <Text style={styles.percentText}>
                        {Math.round(item.percent * 100)}%
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9F9" },
  dateControlRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 15,
  },
  arrowButton: { padding: 10 },
  dateDisplay: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F4FF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginHorizontal: 15,
    minWidth: 160,
    justifyContent: "center",
  },
  dateText: { fontFamily: "Montserrat-SemiBold", color: "#333", fontSize: 15 },
  switchWrapper: { alignItems: "center", marginBottom: 20 },
  switchContainer: {
    flexDirection: "row",
    backgroundColor: "#EFEFEF",
    borderRadius: 12,
    padding: 4,
    width: "90%",
  },
  switchBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  switchBtnActive: { backgroundColor: "#FFFFFF", elevation: 2 },
  switchText: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 14,
    color: "#999",
  },
  cardContainer: {
    marginHorizontal: 20,
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: "Montserrat-Bold",
    fontSize: 16,
    color: "#1F41BB",
    marginBottom: 15,
  },
  noDataText: { textAlign: "center", color: "#999", marginVertical: 30 },
  pieContainer: { alignItems: "center", marginBottom: 20 },
  listContainer: { marginTop: 10 },
  rankItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  rankItemActive: { backgroundColor: "#F0F4FF" },
  rankIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  rankContent: { flex: 1 },
  rankRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  rankName: { fontFamily: "Montserrat-SemiBold", fontSize: 13, color: "#333" },
  rankAmount: { fontFamily: "Montserrat-Bold", fontSize: 13, color: "#333" },
  progressBarBg: {
    height: 4,
    backgroundColor: "#F0F0F0",
    borderRadius: 2,
    width: "100%",
    marginBottom: 2,
  },
  progressBarFill: { height: "100%", borderRadius: 2 },
  percentText: {
    fontFamily: "Montserrat-Regular",
    fontSize: 10,
    color: "#AAA",
    textAlign: "right",
  },
});
