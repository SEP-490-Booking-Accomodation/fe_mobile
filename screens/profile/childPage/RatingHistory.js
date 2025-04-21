"use client"
import { useState } from "react"
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    RefreshControl,
    ActivityIndicator,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { ArrowLeft, Star, ChevronRight, Calendar } from "lucide-react-native"

// Mock data for testing
const MOCK_FEEDBACKS = [
    {
        id: "1",
        rating: 5,
        content:
            "Phòng rất sạch sẽ và thoáng mát. Nhân viên phục vụ nhiệt tình, vị trí thuận tiện để đi lại. Tôi rất hài lòng với trải nghiệm này và chắc chắn sẽ quay lại.",
        createdAt: "2023-10-15T08:30:00Z",
        updatedAt: "2023-10-15T08:30:00Z",
        images: [
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=2025&auto=format&fit=crop",
        ],
        contentReply:
            "Cảm ơn bạn đã đánh giá tích cực. Chúng tôi rất vui khi bạn đã có trải nghiệm tốt và mong được đón tiếp bạn trong tương lai!",
        bookingId: {
            id: "b001",
            accommodationId: {
                image: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"],
                accommodationTypeId: {
                    name: "Phòng Deluxe Hướng Biển",
                },
                rentalLocationId: {
                    city: "Đà Nẵng",
                    name: "Khách sạn Ánh Dương",
                    address: "123 Nguyễn Văn Linh",
                    ward: "Hải Châu",
                    district: "Hải Châu",
                },
            },
        },
    },
    {
        id: "2",
        rating: 4,
        content:
            "Phòng đẹp, view tuyệt vời. Tuy nhiên, dịch vụ ăn sáng còn hạn chế về lựa chọn. Nhìn chung là một trải nghiệm tốt.",
        createdAt: "2023-09-22T10:15:00Z",
        updatedAt: "2023-09-22T14:30:00Z",
        images: [],
        contentReply: null,
        bookingId: {
            id: "b002",
            accommodationId: {
                image: ["https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070&auto=format&fit=crop"],
                accommodationTypeId: {
                    name: "Phòng Superior",
                },
                rentalLocationId: {
                    city: "Hồ Chí Minh",
                    name: "Khách sạn Sài Gòn",
                    address: "45 Lê Lợi",
                    ward: "Bến Nghé",
                    district: "Quận 1",
                },
            },
        },
    },
    {
        id: "3",
        rating: 3,
        content: "Phòng ở mức trung bình, hơi ồn vì gần đường lớn. Nhân viên phục vụ tốt nhưng check-in hơi chậm.",
        createdAt: "2023-08-05T15:45:00Z",
        updatedAt: "2023-08-06T09:20:00Z",
        images: ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=2070&auto=format&fit=crop"],
        contentReply:
            "Chúng tôi xin lỗi vì những bất tiện bạn đã gặp phải. Chúng tôi sẽ cải thiện quy trình check-in và xem xét giải pháp cách âm tốt hơn cho các phòng gần đường.",
        bookingId: {
            id: "b003",
            accommodationId: {
                image: ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=2070&auto=format&fit=crop"],
                accommodationTypeId: {
                    name: "Phòng Standard",
                },
                rentalLocationId: {
                    city: "Hà Nội",
                    name: "Khách sạn Thăng Long",
                    address: "78 Trần Duy Hưng",
                    ward: "Trung Hòa",
                    district: "Cầu Giấy",
                },
            },
        },
    },
]

export default function RatingHistory() {
    const navigation = useNavigation()
    const [refreshing, setRefreshing] = useState(false)
    const [selectedRating, setSelectedRating] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    // Use mock data instead of API
    const [feedbacksData, setFeedbacksData] = useState(MOCK_FEEDBACKS)

    // Simulate API refresh
    const onRefresh = async () => {
        setRefreshing(true)
        // Simulate network delay
        setTimeout(() => {
            setRefreshing(false)
        }, 1000)
    }

    const handleViewRatingDetail = (rating) => {
        setSelectedRating(rating)
    }

    const handleBackToList = () => {
        setSelectedRating(null)
    }

    const handleViewBooking = (bookingId) => {
        // Navigate to booking detail
        navigation.navigate("BookingDetail", { bookingId })
        console.log("Navigating to booking:", bookingId)
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    // Render the rating stars
    const renderStars = (rating) => {
        return (
            <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={16}
                        fill={star <= rating ? "#FFB800" : "transparent"}
                        color={star <= rating ? "#FFB800" : "#D1D5DB"}
                    />
                ))}
            </View>
        )
    }

    // Render the rating detail view
    const renderRatingDetail = () => {
        if (!selectedRating) return null

        return (
            <View style={styles.detailContainer}>
                <View style={styles.detailHeader}>
                    <TouchableOpacity onPress={handleBackToList} style={styles.backButton}>
                        <ArrowLeft size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.detailHeaderTitle}>Chi tiết đánh giá</Text>
                    <View style={{ width: 24 }} />
                </View>

                <ScrollView style={styles.detailContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.accommodationCard}>
                        <Image
                            source={{
                                uri: selectedRating.bookingId?.accommodationId?.image?.[0] || "/placeholder.svg?height=100&width=100",
                            }}
                            style={styles.accommodationImage}
                        />
                        <View style={styles.accommodationInfo}>
                            <Text style={styles.accommodationName}>
                                {selectedRating.bookingId?.accommodationId?.accommodationTypeId?.name || "Phòng"}
                            </Text>
                            <Text style={styles.accommodationLocation}>
                                {selectedRating.bookingId?.accommodationId?.rentalLocationId?.city || "Địa điểm"}
                            </Text>
                            <View style={styles.ratingDateRow}>
                                <Calendar size={14} color="#6B7280" />
                                <Text style={styles.ratingDate}>{formatDate(selectedRating.createdAt)}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.ratingSection}>
                        <Text style={styles.sectionTitle}>Đánh giá của bạn</Text>
                        <View style={styles.ratingBox}>
                            <View style={styles.ratingHeader}>
                                <Text style={styles.ratingValue}>{selectedRating.rating.toFixed(1)}</Text>
                                {renderStars(selectedRating.rating)}
                            </View>
                            <Text style={styles.ratingContent}>{selectedRating.content}</Text>

                            {selectedRating.images && selectedRating.images.length > 0 && (
                                <View style={styles.ratingImages}>
                                    <Text style={styles.imagesTitle}>Hình ảnh</Text>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                        {selectedRating.images.map((image, index) => (
                                            <Image key={index} source={{ uri: image }} style={styles.ratingImage} />
                                        ))}
                                    </ScrollView>
                                </View>
                            )}
                        </View>
                    </View>

                    {selectedRating.contentReply && (
                        <View style={styles.replySection}>
                            <Text style={styles.sectionTitle}>Phản hồi từ chủ nhà</Text>
                            <View style={styles.replyBox}>
                                <Text style={styles.replyContent}>{selectedRating.contentReply}</Text>
                                <Text style={styles.replyDate}>{selectedRating.updatedAt && formatDate(selectedRating.updatedAt)}</Text>
                            </View>
                        </View>
                    )}

                    <TouchableOpacity
                        style={styles.viewBookingButton}
                        onPress={() => handleViewBooking(selectedRating.bookingId.id)}
                    >
                        <Text style={styles.viewBookingText}>Xem chi tiết đặt phòng</Text>
                        <ChevronRight size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                </ScrollView>
            </View>
        )
    }

    // Render the rating list view
    const renderRatingList = () => {
        if (isLoading) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#ff385c" />
                    <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
                </View>
            )
        }

        if (!feedbacksData || feedbacksData.length === 0) {
            return (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Bạn chưa có đánh giá nào</Text>
                </View>
            )
        }

        return (
            <ScrollView
                style={styles.scrollView}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#ff385c"]} tintColor="#ff385c" />
                }
            >
                {feedbacksData.map((rating) => (
                    <TouchableOpacity key={rating.id} style={styles.ratingCard} onPress={() => handleViewRatingDetail(rating)}>
                        <View style={styles.ratingCardHeader}>
                            <Image
                                source={{ uri: rating.bookingId?.accommodationId?.image?.[0] || "/placeholder.svg?height=60&width=60" }}
                                style={styles.ratingCardImage}
                            />
                            <View style={styles.ratingCardInfo}>
                                <Text style={styles.ratingCardTitle} numberOfLines={1}>
                                    {rating.bookingId?.accommodationId?.accommodationTypeId?.name || "Phòng"}
                                </Text>
                                <Text style={styles.ratingCardLocation} numberOfLines={1}>
                                    {rating.bookingId?.accommodationId?.rentalLocationId?.city || "Địa điểm"}
                                </Text>
                                <View style={styles.ratingCardStars}>
                                    {renderStars(rating.rating)}
                                    <Text style={styles.ratingCardDate}>{formatDate(rating.createdAt)}</Text>
                                </View>
                            </View>
                            <ChevronRight size={20} color="#6B7280" />
                        </View>
                        <Text style={styles.ratingCardContent} numberOfLines={2}>
                            {rating.content}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            {selectedRating ? (
                renderRatingDetail()
            ) : (
                <>
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.backButton}  onPress={() => navigation.goBack()}> 
                            </TouchableOpacity>
                        <Text style={styles.headerTitle}>Lịch sử đánh giá</Text>
                    </View>
                    {renderRatingList()}
                </>
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9f9f9",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        padding: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
    },
    scrollView: {
        flex: 1,
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "#6B7280",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: "#6B7280",
    },
    ratingCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    ratingCardHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    ratingCardImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
    },
    ratingCardInfo: {
        flex: 1,
    },
    ratingCardTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 4,
    },
    ratingCardLocation: {
        fontSize: 14,
        color: "#6B7280",
        marginBottom: 4,
    },
    ratingCardStars: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    ratingCardDate: {
        fontSize: 12,
        color: "#6B7280",
    },
    ratingCardContent: {
        fontSize: 14,
        color: "#374151",
        lineHeight: 20,
    },
    starsContainer: {
        flexDirection: "row",
        alignItems: "center",
    },

    // Detail view styles
    detailContainer: {
        flex: 1,
        backgroundColor: "#f9f9f9",
    },
    detailHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        padding: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    backButton: {
        padding: 4,
    },
    detailHeaderTitle: {
        fontSize: 18,
        fontWeight: "600",
    },
    detailContent: {
        flex: 1,
        padding: 16,
    },
    accommodationCard: {
        flexDirection: "row",
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    accommodationImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 12,
    },
    accommodationInfo: {
        flex: 1,
        justifyContent: "center",
    },
    accommodationName: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 4,
    },
    accommodationLocation: {
        fontSize: 14,
        color: "#6B7280",
        marginBottom: 8,
    },
    ratingDateRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    ratingDate: {
        fontSize: 12,
        color: "#6B7280",
        marginLeft: 4,
    },
    ratingSection: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 8,
    },
    ratingBox: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    ratingHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    ratingValue: {
        fontSize: 18,
        fontWeight: "bold",
        marginRight: 8,
        color: "#FFB800",
    },
    ratingContent: {
        fontSize: 14,
        color: "#374151",
        lineHeight: 20,
        marginBottom: 12,
    },
    ratingImages: {
        marginTop: 8,
    },
    imagesTitle: {
        fontSize: 14,
        fontWeight: "500",
        marginBottom: 8,
    },
    ratingImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginRight: 8,
    },
    replySection: {
        marginBottom: 16,
    },
    replyBox: {
        backgroundColor: "#F3F4F6",
        borderRadius: 12,
        padding: 16,
    },
    replyContent: {
        fontSize: 14,
        color: "#374151",
        lineHeight: 20,
        marginBottom: 8,
    },
    replyDate: {
        fontSize: 12,
        color: "#6B7280",
        textAlign: "right",
    },
    viewBookingButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ff385c",
        borderRadius: 12,
        padding: 16,
        marginTop: 16,
        marginBottom: 32,
    },
    viewBookingText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#FFFFFF",
        marginRight: 8,
    },
})
